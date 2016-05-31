import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Icon from '../../shared/Icon';
import Dropdown from '../../shared/Dropdown';
import BuildState from '../../icons/BuildState';
import Favorite from '../../icons/Favorite';
import Emojify from '../../shared/Emojify';

import permissions from '../../../lib/permissions';

import PipelineFavoriteMutation from '../../../mutations/PipelineFavorite';

import Metric from './metric';
import Graph from './graph';
import SectionLink from './section-link';
import Build from './build';

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
      }).isRequired
    }).isRequired
  };

  state = {
    showingMenu: false
  };

  render() {
    return (
      <div className="flex items-stretch border border-gray rounded mb2" style={{height: 82}}>
        {this.renderFeaturedBuildIcon()}

        <SectionLink className="flex items-center flex-auto px2" href={this.props.pipeline.url}>
          <div className="truncate">
            <h2 className="h4 regular m0 line-height-2">{this.props.pipeline.name}</h2>
            {this.renderDescription()}
          </div>
        </SectionLink>

        <div className="flex flex-none items-center justify-end mr2">
          {this.props.pipeline.metrics.edges.map((edge) => {
            return (
              <Metric key={edge.node.label} label={edge.node.label} value={edge.node.value} href={edge.node.url} />
              );
          })}
        </div>

        <div className="flex items-center flex-none ml3 xs-hide sm-hide pr3">
          <div>
            <div className="h6 regular dark-gray mb1 line-height-1">{this.props.pipeline.defaultBranch}</div>
            <Graph builds={this.props.pipeline.defaultBranchBuilds}  />
          </div>
        </div>

        {this.renderActions()}
      </div>
    );
  }

  renderDescription() {
    if(this.props.pipeline.description) {
      return (
        <div className="truncate dark-gray" style={{ marginTop: 3 }}>
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
        <div className="flex flex-none items-center pl3 pr2">
          <Build build={featuredBuild}>
            <SectionLink href={featuredBuild.url} className="block line-height-1">
              <BuildState state={featuredBuild.state} />
            </SectionLink>
          </Build>
        </div>
      );
    } else {
      return (
        <div className="flex flex-none items-center pl3 pr2">
          <BuildState state="pending" />
        </div>
      );
    }
  }

  renderActions() {
    // Make sure we're allowed to favorite this pipeline
    let favoriteButton = permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineFavorite",
        render: () => {
          return (
            <button className="btn p0" onClick={this.handleFavoriteClick}>
              <Favorite favorite={this.props.pipeline.favorite} />
            </button>
          );
        }
      }
    )

    // Make sure we can perform the actions inside the dropdown
    let dropdownActions = permissions(this.props.pipeline.permissions).collect(
      {
        allowed: "pipelineUpdate",
        render: () => {
          return (
            <a key="pipeline-update" href={`${this.props.pipeline.url}/settings`} className="btn block hover-lime">Configure Pipeline</a>
          );
        }
      }
    )

    // Only render the dropdown button if there's something to put inside it
    let dropdownButton;
    if(dropdownActions.length > 0) {
      dropdownButton = (
        <Dropdown align="center" width={180} onToggle={this.handleMenuToggle}>
          <button className="btn p0 gray hover-dark-gray">
            <Icon icon="menu" className={classNames({ "dark-gray": this.state.showingMenu })} />
          </button>
          {dropdownActions}
        </Dropdown>
      );
    }

    let dividerElement;
    if(favoriteButton && dropdownButton) {
      dividerElement = (
        <div className="mb1"></div>
      );
    }

    return (
      <div className="flex flex-none flex-column justify-center ml-auto pr3">
        {favoriteButton}
        {dividerElement}
        {dropdownButton}
      </div>
    );
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
        permissions {
          pipelineFavorite {
            allowed
          }
          pipelineUpdate {
            allowed
          }
        }
      }
    `
  }
});
