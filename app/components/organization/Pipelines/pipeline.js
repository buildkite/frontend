import React from 'react';

import Metric from './metric';
import SectionLink from './section-link';
import Icon from '../../shared/Icon';

export default class Pipeline extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
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

  // TODO: Remove this when there's proper data
  constructor(props) {
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

  render() {
    return (
      <div className="border border-gray rounded flex items-stretch mb2 line-height-1">
        <SectionLink className="flex flex-none items-center p3">
          <Icon className="ml1"/>
        </SectionLink>
        <SectionLink className="flex flex-column justify-center px2 py3" style={{width:'15em'}} href={this._pipelineUrl()}>
          <h2 className="h4 regular m0 truncate">{this.props.pipeline.name}</h2>
          {this.props.pipeline.description ? <h3 className="h5 regular m0 truncate mt1">{this.props.pipeline.description}</h3> : null}
        </SectionLink>
        <div className="flex items-center">
          <Metric label="Running" value={this.props.pipeline.scheduledBuildsCount} href={this._pipelineUrl("/builds?state=scheduled")}/>
          <Metric label="Scheduled" value={this.props.pipeline.runningBuildsCount} href={this._pipelineUrl("/builds?state=running")}/>
          <Metric label="Dev Build Avg" value={"3.2min"} />
        </div>
        <div className="flex flex-none flex-column justify-center ml-auto px3">
          <a className="my1" href=""><Icon/></a>
          <a className="my1" href=""><Icon/></a>
        </div>
      </div>
    );
  }

  _renderLastBuild() {
    const lastBuild = this.props.pipeline.lastDefaultBranchBuild;
    const href = lastBuild && this._pipelineUrl(`/builds/${this.props.pipeline.lastDefaultBranchBuild.number}`);

    return (
      <SectionLink href={href} className="flex flex-none items-center p3">
        <Icon icon="placeholder" className="ml1" />
      </SectionLink>
    );
  }

  _pipelineUrl(path) {
    return `/${this.props.organization.slug}/${this.props.pipeline.slug}${path || ''}`
  }
}
