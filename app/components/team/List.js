import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import Panel from '../shared/Panel'

class List extends React.Component {
  render() {
    return (
      <Panel>
        <Panel.Header>Teams</Panel.Header>
        <Panel.IntroWithButton>
          <span>Manage your teams and make some awesome ones so you can do super awesome stuff like organzing users and projects into teams so you can do permissions and stuff.</span>
          <Link className="btn bg-blue white rounded hover-white block nowrap" to={`/organizations/${this.props.organization.slug}/teams/new`}>New Team</Link>
        </Panel.IntroWithButton>
        {
          this.props.organization.teams.edges.map((team) => {
            return (
	      <Panel.RowLink key={team.node.id} to={`/organizations/${this.props.organization.slug}/teams/${team.node.slug}`}>
		<strong className="semi-bold">{team.node.name}</strong><br/>
		<span className="gray">{team.node.members.count} members · {team.node.pipelines.count} projects</span><br/>
	      </Panel.RowLink>
            )
          })
        }
      </Panel>
    );
  }
}

export default Relay.createContainer(List, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
         slug
         teams(first: 100) {
           edges {
             node {
               id,
               name,
               description,
               slug,
               members {
                 count
               },
               pipelines {
                 count
               }
             }
           }
         }
      }
    `
  }
});
