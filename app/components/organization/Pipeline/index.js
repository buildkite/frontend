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
      lastDefaultBranchBuild: React.PropTypes.shape({
        number: React.PropTypes.number.isRequired,
        state: React.PropTypes.oneOf(["passed","failed","paused","canceled","skipped"]).isRequired
      })
    }).isRequired
  };

  state = {
    showingMenu: false
  };

  // TODO: Remove this when there's proper data
  constructor(props) {
    if (Math.random() < 0.75) {
      props.pipeline.lastDefaultBranchBuild = {
        number: 42,
        state: ["running","scheduled"][Math.floor(Math.random() * 2)]
      }
    }

    super(props);
  }

  render() {
    return (
      <div className="border border-gray rounded flex items-stretch mb2 line-height-1">
        {this._renderLastBuild()}

        <SectionLink className="flex flex-column justify-center px2 py3" style={{width:'15em'}} href={this.props.pipeline.url}>
          <h2 className="h4 regular m0 truncate">{this.props.pipeline.name}</h2>
          {this.props.pipeline.description ? <Emojify className="h5 regular m0 truncate mt1 dark-gray" text={this.props.pipeline.description} /> : null}
        </SectionLink>

        <div className="flex items-center flex-stretch flex-auto">
          {this.props.pipeline.metrics.edges.map((edge) => <Metric key={edge.node.label} label={edge.node.label} value={edge.node.value} href={edge.node.url}/>)}
        </div>

        <Graph branch={this.props.pipeline.defaultBranch} />

        <div className="flex flex-none flex-column justify-center ml-auto px3">
          <button className="my1 btn p0" onClick={this.handleFavoriteClick}>
            <Favorite favorite={this.props.pipeline.favorite} />
          </button>

          <Dropdown align="center" width={180} onToggle={this.handleMenuToggle}>
            <button className="my1 btn p0 gray hover-dark-gray">
              <Icon icon="menu" className={classNames({ "dark-gray": this.state.showingMenu })} />
            </button>

            <a href={`${this.props.pipeline.url}/settings`} className="btn block hover-lime">Configure Pipeline</a>
          </Dropdown>
        </div>
      </div>
    );
  }

  _renderLastBuild() {
    const lastBuild = this.props.pipeline.lastDefaultBranchBuild;

    return (
      <SectionLink href={"#"} className="flex flex-none items-center pl3 pr2">
        <BuildState state={lastBuild && lastBuild.state || 'pending'} className="ml1" />
      </SectionLink>
    );
  }

  handleMenuToggle = (visible) => {
    this.setState({ showingMenu: visible });
  };

  handleFavoriteClick = () => {
    // Create the PipelineFavoriteMutation mutation
    var mutation = new PipelineFavoriteMutation({
      pipeline: this.props.pipeline,
      favorite: !this.props.pipeline.favorite
    });

    // Run the mutation with basic failure handling
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
      }
    `
  }
});
