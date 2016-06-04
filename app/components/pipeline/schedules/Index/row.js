import React from 'react';
import Relay from 'react-relay';

import Panel from '../../../shared/Panel'
import Button from '../../../shared/Button'
import Emojify from '../../../shared/Emojify'
import permissions from '../../../../lib/permissions';

class Row extends React.Component {
  render() {
    let organization = this.props.pipelineSchedule.pipeline.organization;
    let pipeline = this.props.pipelineSchedule.pipeline;

    return (
      <Panel.RowLink to={`/${organization.slug}/${pipeline.slug}/settings/schedules/${this.props.pipelineSchedule.uuid}`}>
        <div className="flex flex-stretch items-center line-height-1" style={{minHeight: '3em'}}>
          <div className="flex-auto">
            <div className="m0 semi-bold">{this.props.pipelineSchedule.cronline}</div>
            {this.renderDescription()}
          </div>
          <div className="flex flex-none flex-stretch items-center my1 pr3">
            <code className="dark-gray">{this.props.pipelineSchedule.branch} | {this.props.pipelineSchedule.commit}</code>
          </div>
        </div>
      </Panel.RowLink>
    );
  }

  renderDescription() {
    if (this.props.pipelineSchedule.description) {
      return (
        <div className="regular dark-gray mt1"><Emojify text={this.props.pipelineSchedule.description} /></div>
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
        description
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
