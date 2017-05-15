import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';

class MemberEditMemberships extends React.PureComponent {
  static propTypes = {
    organizationMember: PropTypes.shape({
      teams: PropTypes.shape({
        edges: PropTypes.array.isRequired
      }).isRequired
    })
  };

  render() {
    const teams = this.props.organizationMember.teams.edges;
    let content;

    if (teams.length) {
      content = this.props.organizationMember.teams.edges.map(({ node }) => (
        <Panel.Section key={node.id}>{node.team.name}</Panel.Section>
      ));
    } else {
      content = (
        <Panel.Section>
          This user is not a member of any teams.
        </Panel.Section>
      );
    }

    return (
      <div>
        <h2 className="h2">Team Memberships</h2>
        <Panel className="mb4">
          {content}
        </Panel>
      </div>
    );
  }
}

export default Relay.createContainer(MemberEditMemberships, {
  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        teams(first: 10) {
          edges {
            node {
              id
              team {
                name
              }
            }
          }
        }
      }
    `
  }
});