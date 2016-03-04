import React from 'react';
import Relay from 'react-relay';
import { IndexLink, Link } from 'react-router';

class SettingsSection extends React.Component {
  render(){
    return (
      <div>
	{this.props.children}
      </div>
    );
  }
}

export default Relay.createContainer(SettingsSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name,
        slug,
        members {
          count
        },
        teams {
          count
        }
      }
    `
  }
});
