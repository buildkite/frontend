import React from 'react';
import Relay from 'react-relay';

import Panel from '../../../shared/Panel'
import Emojify from '../../../shared/Emojify'

class Row extends React.Component {
  static propTypes = {
    pipelineSchedule: React.PropTypes.shape({
      uuid: React.PropTypes.string.isRequired,
      cronline: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      commit: React.PropTypes.string,
      branch: React.PropTypes.string,
      pipeline: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired,
        organization: React.PropTypes.shape({
          slug: React.PropTypes.string.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    let organization = this.props.pipelineSchedule.pipeline.organization;
    let pipeline = this.props.pipelineSchedule.pipeline;

    return (
      <Panel.RowLink to={`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}`}>
        <div className="flex flex-stretch items-center line-height-1" style={{minHeight: '3em'}}>
          <div className="flex-auto">
            <div className="m0 semi-bold">{this.props.pipelineSchedule.cronline}</div>
            {this.renderLabel()}
          </div>
          <div className="flex flex-none flex-stretch items-center my1 pr3">
            <code className="dark-gray">{this.props.pipelineSchedule.branch} | {this.props.pipelineSchedule.commit}</code>
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  renderLabel() {
    if (this.props.pipelineSchedule.label) {
      return (
        <div className="regular dark-gray mt1"><Emojify text={this.props.pipelineSchedule.label} /></div>
      );
    }
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    pipelineSchedule: () => Relay.QL`
      fragment on PipelineSchedule {
        uuid
        cronline
        label
        commit
        branch
        pipeline {
          slug
          organization {
            slug
          }
        }
      }
    `
  }
});
