import React from 'react';
import Relay from 'react-relay';

import Icon from '../../shared/Icon';
import BuildStatus from '../../icons/BuildStatus';
import Favorite from '../../icons/Favorite';

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

  // TODO: Remove this when there's proper data
  constructor(props) {
    props.pipeline.medianTime = `${Math.round(Math.random() * 10, 0)}.${Math.round(Math.random() * 9, 0)}min`;
    props.pipeline.passRate = `${Math.round(Math.random() * 100, 0)}`;
    props.pipeline.passesPerMonth = `${Math.round(Math.random() * 100, 0)}`;

    if (Math.random() < 0.75) {
      props.pipeline.lastDefaultBranchBuild = {
        number: 42,
        state: ["passed","failed","paused","canceled"][Math.floor(Math.random() * 4)]
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
          {this.props.pipeline.description ? <h3 className="h5 regular m0 truncate mt1 dark-gray">{this.props.pipeline.description}</h3> : null}
        </SectionLink>

        <div className="flex items-center flex-stretch flex-auto">
          {this.props.pipeline.metrics.edges.map((edge) => <Metric label={edge.node.label} value={edge.node.value} href={edge.node.url}/>)}
        </div>

        <Graph branch={this.props.pipeline.defaultBranch} />

        <div className="flex flex-none flex-column justify-center ml-auto px3">
          <button className="my1 btn p0">
            <Favorite favorite={this.props.pipeline.favorite} />
          </button>
          <button className="my1 btn p0">
            <svg width="5px" height="19px" viewBox="0 0 5 19">
              <title>Settings</title>
              <g fill="#BBBBBB">
                <circle cx="2.5" cy="2.5" r="2.5"></circle>
                <circle cx="2.5" cy="9.5" r="2.5"></circle>
                <circle cx="2.5" cy="16.5" r="2.5"></circle>
              </g>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  _renderLastBuild() {
    const lastBuild = this.props.pipeline.lastDefaultBranchBuild;

    return (
      <SectionLink href={"#"} className="flex flex-none items-center pl3 pr2">
        <BuildStatus status={lastBuild && lastBuild.state || 'pending'} className="ml1" />
      </SectionLink>
    );
  }
}

export default Relay.createContainer(Pipeline, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
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
	scheduledBuilds: builds(state: BUILD_STATE_SCHEDULED) {
	  count
	}
	runningBuilds: builds(state: BUILD_STATE_RUNNING) {
	  count
	}
      }
    `
  }
});
