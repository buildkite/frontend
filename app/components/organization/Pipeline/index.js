import React from 'react';
import Relay from 'react-relay';

import Icon from '../../shared/Icon';
import BuildStatus from '../../icons/BuildStatus';

import Metric from './metric';
import Graph from './graph';
import SectionLink from './section-link';

class Pipeline extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      defaultBranch: React.PropTypes.string.isRequired,
      favorite: React.PropTypes.bool.isRequired,
      runningBuilds: React.PropTypes.shape({
	count: React.PropTypes.number.isRequired
      }).isRequired,
      scheduledBuilds: React.PropTypes.shape({
	count: React.PropTypes.number.isRequired
      }).isRequired,
      lastDefaultBranchBuild: React.PropTypes.shape({
        number: React.PropTypes.number.isRequired,
        state: React.PropTypes.oneOf(["passed","failed","paused","canceled","skipped"]).isRequired
      })
    }).isRequired
  };

  // TODO: Remove this when there's proper data
  constructor(props) {
    props.pipeline.favorite = Math.random() < 0.5;
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

        <SectionLink className="flex flex-column justify-center px2 py3" style={{width:'15em'}} href={this._pipelineUrl()}>
          <h2 className="h4 regular m0 truncate">{this.props.pipeline.name}</h2>
          {this.props.pipeline.description ? <h3 className="h5 regular m0 truncate mt1 dark-gray">{this.props.pipeline.description}</h3> : null}
        </SectionLink>

        <div className="flex items-center items-stretch">
          <Metric label="Running" value={this.props.pipeline.runningBuilds.count} href={this._pipelineUrl("/builds?state=running")}/>
          <Metric label="Scheduled" value={this.props.pipeline.scheduledBuilds.count} href={this._pipelineUrl("/builds?state=scheduled")}/>
          <Metric label="Builds" value={`${Math.floor(Math.random() * 100)}/day`} />
          <Metric label="Releases" value={`${Math.floor(Math.random() * 50)}/day`} />
          <Metric label="Speed" value={`${Math.floor(1 + Math.random() * 10)}min`} />
          <Metric label="Pass Rate" value={`${Math.floor(75 + Math.random() * 25)}%`} />
        </div>

        <Graph branch={this.props.pipeline.defaultBranch} />

        <div className="flex flex-none flex-column justify-center ml-auto px3">
          <button className="my1 btn p0">
            <svg width="16px" height="15px" viewBox="0 0 16 15">
              <title>Favorite</title>
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fillOpacity="0.3">
                <g transform="translate(-1157.000000, -134.000000)" stroke="#F8CC1C" fill="#F8CC1C">
                  <g transform="translate(54.000000, 115.000000)">
                    <polygon points="1111 31 1106.29772 33.472136 1107.19577 28.236068 1103.39155 24.527864 1108.64886 23.763932 1111 19 1113.35114 23.763932 1118.60845 24.527864 1114.80423 28.236068 1115.70228 33.472136"></polygon>
                  </g>
                </g>
              </g>
            </svg>
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
    const href = lastBuild && this._pipelineUrl(`/builds/${this.props.pipeline.lastDefaultBranchBuild.number}`);

    return (
      <SectionLink href={href} className="flex flex-none items-center pl3 pr2">
        <BuildStatus status={lastBuild && lastBuild.state || 'pending'} className="ml1" />
      </SectionLink>
    );
  }

  _pipelineUrl(path) {
    return `/${this.props.organization.slug}/${this.props.pipeline.slug}${path || ''}`
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
