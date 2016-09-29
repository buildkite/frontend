import React from 'react';
import Relay from 'react-relay';

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
    pipeline: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      defaultBranch: React.PropTypes.string.isRequired,
      favorite: React.PropTypes.bool.isRequired,
      url: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.shape({
        pipelineFavorite: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
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
      <div className="flex items-stretch border border-gray rounded mb2" style={{ height: 82 }}>
        <div className="flex flex-none items-center pl4 pr2">
          <Status pipeline={this.props.pipeline} />
        </div>

        <a href={this.props.pipeline.url} className="flex flex-auto items-center px2 text-decoration-none color-inherit mr3">
          <div className="truncate">
            <h2 className="h4 regular m0 line-height-2">{this.props.pipeline.name}</h2>
            {this.renderDescription()}
          </div>
        </a>

        {this.renderGraph()}

        <div className="flex flex-none items-center justify-start ml2">
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
          {this.props.pipeline.description ? <Emojify className="h5 regular" text={this.props.pipeline.description} /> : null}
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
        <div style={{width: 239}}></div>
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
      <div className="flex flex-none flex-column justify-center ml-auto pr4">
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
