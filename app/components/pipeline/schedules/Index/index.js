import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import permissions from 'app/lib/permissions';

import Row from './row';

class Index extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired,
      schedules: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired,
              failedAt: PropTypes.string
            }).isRequired
          }).isRequired
        )
      }).isRequired,
      permissions: PropTypes.shape({
        pipelineScheduleCreate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired,
    params: PropTypes.shape({
      organization: PropTypes.string.isRequired,
      pipeline: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Schedules · ${this.props.pipeline.name}`}>
        <React.Fragment>
          {this.renderFailureMessage()}
          <Panel>
            <Panel.Header>Schedules</Panel.Header>

            <Panel.IntroWithButton>
              <span>Build schedules automatically create builds at specified intervals.</span>
              {this.renderNewScheduleButton()}
            </Panel.IntroWithButton>
            {this.renderScheduleRows()}
          </Panel>
        </React.Fragment>
      </DocumentTitle>
    );
  }

  renderFailureMessage() {
    const schedules = this.props.pipeline.schedules.edges;

    const failedSchedules = schedules.filter((edge) => edge.node.failedAt);

    const plural = failedSchedules.length !== 1;

    if (failedSchedules.length > 0) {
      return (
        <div className="mb4 p2 border border-red rounded red flex items-center">
          <span className="m1">
            {plural ? 'Several of your schedules have' : 'One of your schedules has'} been automatically disabled due to {plural ? 'errors' : 'an error'}.
          </span>
        </div>
      );
    }

    return null;
  }

  renderNewScheduleButton() {
    return permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineScheduleCreate",
        render: () => <Button link={`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules/new`}>New Schedule</Button>
      }
    );
  }

  renderScheduleRows() {
    const schedules = this.props.pipeline.schedules.edges;

    if (schedules.length > 0) {
      return schedules.map((edge) => {
        return (
          <Row key={edge.node.id} pipelineSchedule={edge.node} />
        );
      });
    }

    return null;
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        schedules(first: 100) {
          edges {
            node {
              id
              failedAt
              ${Row.getFragment("pipelineSchedule")}
            }
          }
        }
        permissions {
          pipelineScheduleCreate {
            allowed
            code
            message
          }
        }
      }
    `
  }
});
