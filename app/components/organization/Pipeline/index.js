import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Favorite from '../../icons/Favorite';
import Emojify from '../../shared/Emojify';

import permissions from '../../../lib/permissions';

import PusherStore from '../../../stores/PusherStore';

import PipelineFavoriteMutation from '../../../mutations/PipelineFavorite';

import Status from './status';
import Metrics from './Metrics';
import Graph from './graph';

class Pipeline extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      description: PropTypes.string,
      defaultBranch: PropTypes.string.isRequired,
      favorite: PropTypes.bool.isRequired,
      url: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        pipelineFavorite: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    showingMenu: false
  };

  componentDidMount() {
    PusherStore.on("websocket:event", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("websocket:event", this.handlePusherWebsocketEvent);
  }

  render() {
    return (
      <div className="flex items-stretch border border-gray rounded px2 mb2" style={{ height: 82 }}>
        <div className="flex flex-none items-center pl2 pr2">
          <Status pipeline={this.props.pipeline} />
        </div>

        <a href={this.props.pipeline.url} className="flex flex-auto items-center px2 text-decoration-none color-inherit mr3">
          <div className="truncate">
            <h2 className="inline h3 regular m0 line-height-2">
              <Emojify text={this.props.pipeline.name} />
            </h2>
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
        <div className="truncate dark-gray" style={{ marginTop: 3 }}>
          <Emojify className="h4 regular" text={this.props.pipeline.description} />
        </div>
      );
    }
  }

  renderGraph() {
    // Toggle between showing the graph, or showing a placeholder until the
    // data is finally loaded in.
    let graph;
    if (this.props.relay.variables.includeGraphData) {
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

    return (
      <div className="flex flex-none flex-column justify-center ml-auto pr2">
        {favoriteButton}
      </div>
    );
  }

  handlePusherWebsocketEvent = (payload) => {
    if (payload.event === "project:updated" && payload.graphql.id === this.props.pipeline.id) {
      this.props.relay.forceFetch();
    }
  };

  handleMenuToggle = (visible) => {
    this.setState({ showingMenu: visible });
  };

  handleFavoriteClick = () => {
    const mutation = new PipelineFavoriteMutation({
      pipeline: this.props.pipeline,
      favorite: !this.props.pipeline.favorite
    });

    Relay.Store.commitUpdate(mutation, {
      onFailure: this.handlePipelineFavoriteMutationFailure
    });
  }

  handlePipelineFavoriteMutationFailure = (transaction) => {
    alert(transaction.getError());
  }
}

export default Relay.createContainer(Pipeline, {
  initialVariables: {
    includeGraphData: false
  },

  fragments: {
    pipeline: (variables) => Relay.QL`
      fragment on Pipeline {
        ${PipelineFavoriteMutation.getFragment('pipeline')}
        ${Status.getFragment('pipeline')}
        ${Metrics.getFragment('pipeline')}
        ${Graph.getFragment('pipeline').if(variables.includeGraphData)}
        id
        name
        slug
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
    `
  }
});
