import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel'
import Button from '../shared/Button'
import permissions from '../../lib/permissions';

import Row from './Row';

class Index extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      teams: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      permissions: React.PropTypes.object.isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.organization.name}`}>
        <Panel>
          <Panel.Header>Teams</Panel.Header>
          <Panel.IntroWithButton>
            <span>Manage your teams and make some awesome ones so you can do super awesome stuff like organzing users and projects into teams so you can do permissions and stuff.</span>
            {this.renderNewTeamButton()}
          </Panel.IntroWithButton>
          {this.props.organization.teams.edges.map((edge) => <Row key={edge.node.id} team={edge.node} />)}
        </Panel>
      </DocumentTitle>
    );
  }

  renderNewTeamButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "teamCreate",
        render: () => <Button link={`/organizations/${this.props.organization.slug}/teams/new`}>New Team</Button>
      }
    )
  }
}

export default Relay.createContainer(Index, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        permissions {
          teamCreate {
            allowed
          }
        }
        teams(first: 100) {
          edges {
            node {
              id
              ${Row.getFragment('team')}
            }
          }
        }
      }
    `
  }
});
