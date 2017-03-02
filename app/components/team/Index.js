import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import permissions from '../../lib/permissions';

import Row from './Row';

class TeamIndex extends React.Component {
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
      }),
      permissions: React.PropTypes.object.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.organization.name}`}>
        <Panel>
          <Panel.Header>Teams</Panel.Header>
          <Panel.IntroWithButton>
            <span>Teams allow you to create groups of users, and assign fine-grained permissions for who can view builds, create builds, and modify pipelines.</span>
            {this.renderNewTeamButton()}
          </Panel.IntroWithButton>
          {this.renderTeams()}
        </Panel>
      </DocumentTitle>
    );
  }

  renderTeams() {
    if (this.props.organization.teams) {
      return this.props.organization.teams.edges.map((edge) => {
        return (
          <Row key={edge.node.id} team={edge.node} />
        );
      });
    } else {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }
  }

  renderNewTeamButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "teamCreate",
        render: () => <Button link={`/organizations/${this.props.organization.slug}/teams/new`} theme={"default"} outline={true}>Create a Team</Button>
      }
    );
  }
}

export default Relay.createContainer(TeamIndex, {
  initialVariables: {
    isMounted: false
  },

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
        teams(first: 100, order: NAME_EVERYONE_FIRST) @include(if: $isMounted) {
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
