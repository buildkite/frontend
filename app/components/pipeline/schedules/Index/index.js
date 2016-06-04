import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../../../shared/Panel'
import PageHeader from '../../../shared/PageHeader'
import Button from '../../../shared/Button'
import permissions from '../../../../lib/permissions';
import PageWithContainer from '../../../shared/PageWithContainer';
import Emojify from '../../../shared/Emojify';

import Row from "./row";

class Index extends React.Component {
  render() {
    return (
      <DocumentTitle title={`Schedules · ${this.props.pipeline.name}`}>
        <PageWithContainer>
          <PageHeader>
            <PageHeader.Title>Schedules</PageHeader.Title>
          </PageHeader>

          <Panel>
            <Panel.IntroWithButton>
              <span>Schedules are a way for you to automatically create builds at a pre-defined time.</span>
              {this.renderNewScheduleButton()}
            </Panel.IntroWithButton>
            {this.renderScheduleRows()}
          </Panel>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderNewScheduleButton() {
    return permissions(this.props.pipeline.permissions).check(
      {
        allowed: "pipelineScheduleCreate",
        render: () => <Button link={`/${this.props.params.organization}/${this.props.params.pipeline}/settings/schedules/new`} theme={"default"} outline={true}>Create a Schedule</Button>
      }
    )
  }

  renderScheduleRows() {
    if(this.props.pipeline.schedules.edges.length > 0) {
      return this.props.pipeline.schedules.edges.map((edge) => {
        return (
          <Row key={edge.node.id} pipelineSchedule={edge.node} />
        )
      })
    } else {
      return (
        <Panel.Row>
          <div className="dark-gray py2 center"><Emojify text="This pipeline doesn't have any schedules yet :eyes:" /></div>
        </Panel.Row>
      );
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
