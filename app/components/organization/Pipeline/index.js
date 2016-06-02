import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Icon from '../../shared/Icon';
import Dropdown from '../../shared/Dropdown';
import Favorite from '../../icons/Favorite';
import Emojify from '../../shared/Emojify';

import permissions from '../../../lib/permissions';

import PipelineFavoriteMutation from '../../../mutations/PipelineFavorite';

import Status from './status';
import Metrics from './metrics';
import Graph from './graph';

class Pipeline extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      defaultBranch: React.PropTypes.string.isRequired,
      favorite: React.PropTypes.bool.isRequired,
      url: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.shape({
        pipelineUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        pipelineFavorite: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired
  };

  state = {
    showingMenu: false
  };

  render() {
    return (
      <div className="flex items-stretch border border-gray rounded mb2" style={{height: 82}}>
        <div className="flex flex-none items-center pl3 pr2">
          <Status pipeline={this.props.pipeline} />
        </div>

        <a href={this.props.pipeline.url} className="flex items-center flex-auto px2 text-decoration-none color-inherit">
          <div className="truncate">
            <h2 className="h4 regular m0 line-height-2">{this.props.pipeline.name}</h2>
            {this.renderDescription()}
          </div>
        </a>

        <div className="flex flex-none items-center justify-end mr2">
          <Metrics pipeline={this.props.pipeline} />
        </div>

        <div className="flex items-center flex-none ml3 xs-hide sm-hide pr3">
          <div>
            <div className="h6 regular dark-gray mb1 line-height-1">{this.props.pipeline.defaultBranch}</div>
            <Graph pipeline={this.props.pipeline}  />
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
        ${Status.getFragment('pipeline')}
        ${Graph.getFragment('pipeline')}
        ${Metrics.getFragment('pipeline')}
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
          pipelineUpdate {
            allowed
          }
        }
      }
    `
  }
});
