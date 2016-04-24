import React from 'react';
import classNames from 'classnames';

import Icon from '../../shared/Icon'

export default class Pipeline extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
    }).isRequired,
    pipeline: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      favorite: React.PropTypes.bool.isRequired,
      runningBuildsCount: React.PropTypes.number.isRequired,
      scheduledBuildsCount: React.PropTypes.number.isRequired,
      lastDefaultBranchBuild: React.PropTypes.shape({
        number: React.PropTypes.number.isRequired,
        state: React.PropTypes.oneOf(["passed","failed","paused","canceled"]).isRequired
      })
    }).isRequired
  };

  constructor(props) {
    // Hack in some mockup props values for now
    props.pipeline.description = Math.random() < 0.5 ? "Lorem Ipsum" : null;
    props.pipeline.favorite = Math.random() < 0.5;
    props.pipeline.runningBuildsCount = Math.floor(Math.random() * 5);
    props.pipeline.scheduledBuildsCount = Math.floor(Math.random() * 10);

    if (Math.random() < 0.75) {
      props.pipeline.lastDefaultBranchBuild = {
        number: 42,
        state: ["passed","failed","paused","canceled"][Math.floor(Math.random() * 4)]
      }
    }

    super(props);
  }

  // TODO: Remove this when there's proper data
  render() {
    return (
      <div className="border border-gray rounded flex items-stretch mb2 line-height-1">
        {this._renderLastBuild()}
        {this._renderLabel()}
        {this._renderMetrics()}
        {this._renderGraph()}
        {this._renderButtons()}
      </div>
    );
  }

  _renderLastBuild() {
    if (this.props.pipeline.lastDefaultBranchBuild) {
      return (
        <a className="p3 flex flex-none items-center text-decoration-none hover-bg-silver" href={this._pipelineUrl(`/builds/${this.props.pipeline.lastDefaultBranchBuild.number}`)}>
          <Icon icon="placeholder" className="ml1" />
        </a>
      )
    } else {
      return (
        <span className="p3 flex flex-none items-center">
          <Icon icon="placeholder" className="ml1" />
        </span>
      )
    }
  }

  _renderLabel() {
    return (
      <a className="flex flex-column justify-center px2 py3 hover-bg-silver text-decoration-none" style={{width:'15em'}} href={this._pipelineUrl()}>
        <h2 className="h4 regular m0 truncate">{this.props.pipeline.name}</h2>
        {this.props.pipeline.description ? <h3 className="h5 regular m0 truncate mt1">{this.props.pipeline.description}</h3> : null}
      </a>
    )
  }

  _renderMetrics() {
    return (
      <div className="flex items-center">
        {this._renderMetric("Running", this.props.pipeline.runningBuildsCount, this._pipelineUrl("/builds?state=running"))}
        {this._renderMetric("Scheduled", this.props.pipeline.scheduledBuildsCount, this._pipelineUrl("/builds?state=scheduled"))}
        {this._renderMetric("Dev Build Avg", "3.2min", null)}
      </div>
    )
  }

  _renderMetric(label, value, href) {
    return (
      <a href={href} className={classNames("flex flex-column items-stretch px2 py3 text-decoration-none", {"hover-bg-silver": href})} style={{width:'6em'}}>
        {this._renderMetricValue(value)}
        <span className="h6 regular dark-gray truncate mt1">{label}</span>
      </a>
    )
  }

  _renderMetricValue(value) {
    let match = String(value).match(/([\d\.]+)(.*)/);

    if (match) {
      return (
        <span class="truncate">
          <span className="h3 light m0 line-height-1">{match[1]}</span>
          <span className="h5 regular m0 line-height-1">{match[2]}</span>
        </span>
      )
    } else {
      return (
        <span className="h3 regular m0 line-height-1 truncate"></span>
      )
    }
  }

  _renderGraph() {
    return (
      <div></div>
    )
  }

  _renderButtons() {
    return (
      <div className="flex flex-none flex-column justify-center ml-auto px3">
        <a className="my1" href=""><Icon icon="placeholder"/></a>
        <a className="my1" href=""><Icon icon="placeholder"/></a>
      </div>
    )
  }

  _pipelineUrl(path) {
    return `/${this.props.organization.slug}/${this.props.pipeline.slug}${path || ''}`
  }
}