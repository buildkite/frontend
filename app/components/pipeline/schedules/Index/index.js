import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../../../shared/Panel';
import Button from '../../../shared/Button';
import permissions from '../../../../lib/permissions';
import Emojify from '../../../shared/Emojify';

import Row from './row';

class Index extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired,
      schedules: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string.isRequired
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
        <Panel>
          <Panel.Header>Schedules</Panel.Header>

          <Panel.IntroWithButton>
            <span>Schedules are a way for you to automatically create builds at a pre-defined time.</span>
            {this.renderNewScheduleButton()}
          </Panel.IntroWithButton>
          {this.renderScheduleRows()}
        </Panel>
      </DocumentTitle>
    );
  }

  renderNewScheduleButton() {
    return permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineScheduleCreate",
        render: () => <Button link={`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules/new`} theme={"default"} outline={true}>Create a Schedule</Button>
      }
    );
  }

  renderScheduleRows() {
    if (this.props.pipeline.schedules.edges.length > 0) {
      return this.props.pipeline.schedules.edges.map((edge) => {
        return (
          <Row key={edge.node.id} pipelineSchedule={edge.node} />
        );
      });
    } else {
      return null;
    }
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
