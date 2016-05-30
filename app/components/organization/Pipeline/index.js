import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Icon from '../../shared/Icon';
import Dropdown from '../../shared/Dropdown';
import BuildState from '../../icons/BuildState';
import Favorite from '../../icons/Favorite';
import Emojify from '../../shared/Emojify';

import PipelineFavoriteMutation from '../../../mutations/PipelineFavorite';

import Metric from './metric';
import Graph from './graph';
import SectionLink from './section-link';

class Pipeline extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      defaultBranch: React.PropTypes.string.isRequired,
      favorite: React.PropTypes.bool.isRequired,
      url: React.PropTypes.string.isRequired,
      metrics: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              label: React.PropTypes.string.isRequired,
              value: React.PropTypes.string,
              url: React.PropTypes.string
            }).isRequired
          }).isRequired
        )
      }).isRequired,
      defaultBranchBuilds: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        )
      }).isRequired,
      featuredDefaultBranchBuilds: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        )
      }).isRequired,
      allBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    showingMenu: false
  };

  render() {
    return (
      <div className="border border-gray rounded flex items-center mb2" style={{height: 82}}>
        {this.renderFeaturedBuildIcon()}

        <SectionLink className="flex-auto px2" href={this.props.pipeline.url}>
          <h2 className="h4 regular m0 truncate">{this.props.pipeline.name}</h2>
          {this.renderDescription()}
        </SectionLink>

        <div className="flex flex-none items-center justify-end mr2">
          {this.renderMetrics()}
        </div>

        {this.renderGraph()}

        <div className="flex flex-none flex-column justify-center ml-auto px3">
          <button className="btn p0 mb1" onClick={this.handleFavoriteClick}>
            <Favorite favorite={this.props.pipeline.favorite} />
          </button>

          <Dropdown align="center" width={180} onToggle={this.handleMenuToggle}>
            <button className="btn p0 gray hover-dark-gray">
              <Icon icon="menu" className={classNames({ "dark-gray": this.state.showingMenu })} />
            </button>

            <a href={`${this.props.pipeline.url}/settings`} className="btn block hover-lime">Configure Pipeline</a>
          </Dropdown>
        </div>
      </div>
    );
  }

  renderDescription() {
    if(this.props.pipeline.description) {
      return (
        <div className="truncate dark-gray mt1">
          {this.props.pipeline.description ? <Emojify className="h5 regular" text={this.props.pipeline.description} /> : null}
        </div>
      );
    }
  }

  renderFeaturedBuildIcon() {
    let featuredBuildEdge = this.props.pipeline.featuredDefaultBranchBuilds.edges[0];

    if(featuredBuildEdge) {
      let featuredBuild = featuredBuildEdge.node;

      return (
        <SectionLink href={featuredBuild.url} className="flex flex-none items-center pl3 pr2">
          <BuildState state={featuredBuild.state} className="ml1" />
        </SectionLink>
      );
    } else {
      return (
        <div className="flex flex-none items-center pl3 pr2">
          <BuildState state="pending" className="ml1" />
        </div>
      );
    }
  }

  renderMetrics() {
    if(this.props.pipeline.allBuilds.count > 0) {
      return this.props.pipeline.metrics.edges.map((edge) => {
        return (
          <Metric key={edge.node.label} label={edge.node.label} value={edge.node.value} href={edge.node.url} />
        );
      })
    }
  }

  renderGraph() {
    if(this.props.pipeline.defaultBranchBuilds.edges.length > 0) {
      return (
        <div className="ml3 flex-none xs-hide sm-hide">
          <div className="h6 regular dark-gray mb1 line-height-1">{this.props.pipeline.defaultBranch}</div>
          <Graph builds={this.props.pipeline.defaultBranchBuilds}  />
        </div>
      )
    }
  }

  handleMenuToggle = (visible) => {
    this.setState({ showingMenu: visible });
  };

  handleFavoriteClick = () => {
    var mutation = new PipelineFavoriteMutation({
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
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${PipelineFavoriteMutation.getFragment('pipeline')}
        id
        name
        slug
        description
        defaultBranch
        url
        favorite
        metrics(first: 6) {
          edges {
            node {
              label
              value
              url
            }
          }
        }
        featuredDefaultBranchBuilds: builds(first: 1, state: [ BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED ]) {
          edges {
            node {
              state
              message
              startedAt
              finishedAt
              url
              user {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
        defaultBranchBuilds: builds(first: 30, state: [ BUILD_STATE_RUNNING, BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED, BUILD_STATE_CANCELING ]) {
          edges {
            node {
              state
              message
              startedAt
              finishedAt
              url
              user {
                name
                avatar {
                  url
                }
              }
            }
          }
        }
        allBuilds: builds {
          count
        }
      }
    `
  }
});
