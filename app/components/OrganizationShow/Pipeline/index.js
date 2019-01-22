// @flow

import * as React from 'react';
import { createRefetchContainer, commitMutation, graphql } from 'react-relay/compat';
import Favorite from 'app/components/icons/Favorite';
import Emojify from 'app/components/shared/Emojify';
import PipelineStatus from 'app/components/shared/PipelineStatus';
import permissions from 'app/lib/permissions';
import PusherStore from 'app/stores/PusherStore';
import CentrifugeStore from 'app/stores/CentrifugeStore';
import Environment from 'app/lib/relay/environment';
import Status from './Status';
import Metrics from './Metrics';
import Graph from './Graph';
import type { RelayRefetchProp } from 'react-relay';
import type { Pipeline_pipeline } from './__generated__/Pipeline_pipeline.graphql';

type Props = {
  pipeline: Pipeline_pipeline,
  includeGraphData: boolean,
  relay: RelayRefetchProp
};

type State = {
  showingMenu: boolean
};

class Pipeline extends React.Component<Props, State> {
  state = {
    showingMenu: false
  };

  componentDidMount() {
    PusherStore.on("websocket:event", this.handleWebsocketEvent);
    CentrifugeStore.on("websocket:event", this.handleWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handleWebsocketEvent);
    CentrifugeStore.off("websocket:event", this.handleWebsocketEvent);
  }

  render() {
    return (
      <div data-testid="pipeline" className="flex items-stretch border border-gray rounded px2 mb2" style={{ height: 82 }}>
        <div className="flex flex-none items-center pl2 pr2">
          <Status pipeline={this.props.pipeline} />
        </div>

        <a href={this.props.pipeline.url} className="flex flex-auto items-center px2 text-decoration-none color-inherit mr3">
          <div className="truncate">
            <div className="flex items-center">
              <h2 data-testid="pipeline__name" className="inline h3 regular m0 line-height-2">
                <Emojify text={this.props.pipeline.name} />
              </h2>
              <PipelineStatus public={this.props.pipeline.public} />
            </div>
            {this.renderDescription()}
          </div>
        </a>

        {this.renderGraph()}

        <div className="flex flex-none items-center justify-start xs-hide ml2">
          <Metrics pipeline={this.props.pipeline} />
        </div>

        {this.renderActions()}
      </div>
    );
  }

  renderDescription() {
    if (this.props.pipeline.description) {
      return (
        <div data-testid="pipeline__description" className="truncate dark-gray" style={{ marginTop: 3 }}>
          <Emojify className="h4 regular" text={this.props.pipeline.description} />
        </div>
      );
    }
  }

  renderGraph() {
    // Toggle between showing the graph, or showing a placeholder until the
    // data is finally loaded in.
    let graph;
    if (this.props.includeGraphData) {
      graph = (
        <div>
          <div className="h6 regular dark-gray mb1 line-height-1">{this.props.pipeline.defaultBranch}</div>
          <Graph pipeline={this.props.pipeline} />
        </div>
      );
    } else {
      graph = (
        <div style={{ width: 239 }}>
          <div className="h6 regular dark-gray mb1 line-height-1">{this.props.pipeline.defaultBranch}</div>
          <div style={{ height: 35 }} className="flex">
            <div style={{ height: 3, width: "100%", marginTop: "auto" }} className="bg-gray animation-loading-bar" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center flex-none ml3 xs-hide sm-hide pr4">
        {graph}
      </div>
    );
  }

  renderActions() {
    // Make sure we're allowed to favorite this pipeline
    const favoriteButton = permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineFavorite",
        render: () => {
          return (
            <button className="btn p0 dark-gray line-height-1" onClick={this.handleFavoriteClick}>
              <Favorite favorite={this.props.pipeline.favorite} />
            </button>
          );
        }
      }
    );

    return favoriteButton ? (
      <div className="flex flex-none flex-column justify-center ml-auto pr2">
        {favoriteButton}
      </div>
    ) : null;
  }

  handleWebsocketEvent = (payload) => {
    if (payload.subevent === "project:updated" && payload.graphql.id === this.props.pipeline.id) {
      const { pipeline: { id }, includeGraphData } = this.props;
      this.props.relay.refetch({ id, includeGraphData });
    }
  };

  handleMenuToggle = (visible) => {
    this.setState({ showingMenu: visible });
  };

  handleFavoriteClick = () => {
    const environment = Environment.get();
    const { pipeline } = this.props;
    const input = { id: pipeline.id, favorite: !pipeline.favorite };

    commitMutation(environment, {
      mutation: graphql`
        mutation PipelineFavoriteMutation($input: PipelineFavoriteInput!) {
          pipelineFavorite(input: $input) {
            pipeline {
              favorite
            }
          }
        }
      `,
      variables: { input },
      optimisticResponse: { pipelineFavorite: { pipeline: input } }
    });
  }
}

export default createRefetchContainer(
  Pipeline,
  graphql`
    fragment Pipeline_pipeline on Pipeline @argumentDefinitions(
      includeGraphData: {type: "Boolean!"}
    ) {
      ...Status_pipeline
      ...Metrics_pipeline
      ...Graph_pipeline @arguments(includeGraphData: $includeGraphData)
      id
      name
      slug
      public
      description
      defaultBranch
      url
      favorite
      permissions {
        pipelineFavorite {
          allowed
        }
      }
    }
  `,
  graphql`
    query PipelineRefetchQuery($id: ID!, $includeGraphData: Boolean!) {
      node(id: $id) {
        ...Pipeline_pipeline @arguments(includeGraphData: $includeGraphData)
      }
    }
  `
);
