import React from 'react';
import Relay from 'react-relay';
import MarkdownIt from 'markdown-it';

import Emojify from '../shared/Emojify';

import PusherStore from '../../stores/PusherStore';

class AnnnotationsList extends React.Component {
  componentDidMount() {
    PusherStore.on("build:annotations_change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("build:annotations_change", this.handlePusherWebsocketEvent);
  }

  render() {
    let annotations = this.props.build.annotations.edges.map((edge) => {
      return this.renderAnnotation(edge.node);
    });

    return (
      <div>{annotations}</div>
    )
  }

  renderAnnotation(annotation) {
    let backgroundColor;
    let borderColor;
    let icon;
    let iconColor;

    if(annotation.style == "SUCCESS") {
      backgroundColor = "green";
      borderColor = "green";
      iconColor = "white";
      icon = "check";
    } else if(annotation.style == "ERROR") {
      backgroundColor = "red";
      borderColor = "red";
      iconColor = "white";
      icon = "times";
    } else if(annotation.style == "INFO") {
      backgroundColor = "blue";
      borderColor = "blue";
      iconColor = "white";
      icon = "info";
    } else if(annotation.style == "WARNING") {
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
        <div className={`bg-${backgroundColor} flex-none flex items-center`} style={{width: 30}}>
          <div className="center flex-auto">
            <i className={`fa fa-${icon} ${iconColor}`}></i>
          </div>
        </div>
        <div className="flex-auto">
          <div className="m3 annotation-body" dangerouslySetInnerHTML={{ __html: annotation.body.html }} />
        </div>
      </div>
    );
  }

  handlePusherWebsocketEvent = (payload) => {
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
          }
        }
      }
    `
  }
});
