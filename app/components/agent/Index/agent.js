import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import Panel from '../../shared/Panel'
import Emojify from '../../shared/Emojify';

class Row extends React.Component {
  static propTypes = {
    agent: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      uuid: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
    }).isRequired
  };

  render() {
    return (
      <Panel.Section>
        <Link to={`/organizations/${this.props.agent.organization.slug}/agents/${this.props.agent.uuid}`}><Emojify text={this.props.agent.name} /></Link>
      </Panel.Section>
    );
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    agent: () => Relay.QL`
      fragment on Agent {
        id
        name
        uuid
        organization {
          slug
        }
      }
    `
  }
});
