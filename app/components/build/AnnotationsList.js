// @flow

import React from 'react';
import Relay from 'react-relay/classic';

import PusherStore from 'app/stores/PusherStore';
import CentrifugeStore from 'app/stores/CentrifugeStore';

import Button from 'app/components/shared/Button';

type Props = {
  build: {
    id: string,
    annotations: {
      edges: Array<{
        node: {
          id: string,
          style: string,
          body: {
            html: ?string
          }
        }
      }>
    }
  },
  relay: Object
};

class AnnnotationsList extends React.Component<Props> {
  componentDidMount() {
    PusherStore.on("build:annotations_change", this.handleWebsocketEvent);
    CentrifugeStore.on("build:annotations_change", this.handleWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("build:annotations_change", this.handleWebsocketEvent);
    CentrifugeStore.off("build:annotations_change", this.handleWebsocketEvent);
  }

  render() {
    const annotations = this.props.build.annotations.edges.map((edge) => {
      return this.renderAnnotation(edge.node);
    });

    return (
      <div>
        {annotations}
        {this.renderShowMore()}
      </div>
    );

  }

  renderShowMore() {
    if (this.props.build.annotations.pageInfo.hasNextPage) {
      return (
        <Button
          outline={true}
          theme="default"
          // onClick={this.props.onShowMore}
        >
          Show more annotations
        </Button>
      );
    }
  }

  handleAnnotationClick = (event: MouseEvent) => {
    // Don't change anything if the user is using any modifier keys
    if ((event.button !== 0) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    // Don't change clicks in things which aren't <a /> elements, or don't have a `href`
    if (!(event.target instanceof HTMLAnchorElement) || !event.target.href) {
      return;
    }

    // Parse the link URL, relative to the current location
    const linkUrl = new URL(event.target.href, window.location.href);

    // Don't do anything to links which go somewhere other than this current page
    if (`${linkUrl.origin}${linkUrl.pathname}` !== `${window.location.origin}${window.location.pathname}`) {
      return;
    }

    const jobId = linkUrl.hash.slice(1);

    // If we can't find a job component for that job ID, don't do anything
    if (!document.getElementById(`job-component-${jobId}`)) {
      return;
    }

    // Finally, if we now know this is a valid URL and job ID,
    // cancel the browser's usual navigation, and emit a "job:focus" event
    event.preventDefault();

    // NOTE: You're supposed to pass a "full" job object here, but
    // only actually consumes "id" and "path" - so here we fake it!
    window.Buildkite.dispatcher.emit(
      "job:focus",
      {
        job: {
          id: jobId,
          path: ((event.target: any): HTMLAnchorElement).href
        }
      }
    );
  }

  renderAnnotation(annotation) {
    let backgroundColor;
    let borderColor;
    let icon;
    let iconColor;

    if (annotation.style === "SUCCESS") {
      backgroundColor = "green";
      borderColor = "green";
      iconColor = "white";
      icon = "check";
    } else if (annotation.style === "ERROR") {
      backgroundColor = "red";
      borderColor = "red";
      iconColor = "white";
      icon = "times";
    } else if (annotation.style === "INFO") {
      backgroundColor = "blue";
      borderColor = "blue";
      iconColor = "white";
      icon = "info";
    } else if (annotation.style === "WARNING") {
      backgroundColor = "orange";
      borderColor = "orange";
      iconColor = "white";
      icon = "warning";
    } else {
      backgroundColor = "gray";
      borderColor = "gray";
      iconColor = "dark-gray";
      icon = "sticky-note-o";
    }

    return (
      <div key={annotation.id} className={`rounded flex items-stretch border-${borderColor} border mb4`}>
        <div className={`bg-${backgroundColor} flex-none flex pt3`} style={{ width: 30 }}>
          <div className="center flex-auto">
            <i className={`fa fa-${icon} ${iconColor}`} />
          </div>
        </div>
        <div className="flex-auto">
          <div
            className="m3 annotation-body"
            onClick={this.handleAnnotationClick}
            dangerouslySetInnerHTML={{
              __html: annotation.body.html
            }}
          />
        </div>
      </div>
    );
  }

  handleWebsocketEvent = (payload) => {
    if (payload.buildID === this.props.build.id) {
      this.props.relay.forceFetch();
    }
  };
}

export default Relay.createContainer(AnnnotationsList, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        id
        annotations(first: 5) {
          edges {
            node {
              id
              style
              body {
                html
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `
  }
});
