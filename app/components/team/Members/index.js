import React from 'react';
import Relay from 'react-relay';

class Members extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <div>Members..</div>
    );
  }
}

export default Relay.createContainer(Members, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        name
      }
    `
  }
});
