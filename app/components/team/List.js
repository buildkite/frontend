import React from 'react';
import Relay from 'react-relay';

class List extends React.Component {
  render() {
    return (
      <div>Loading...</div>
    );
  }
}

export default Relay.createContainer(List, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
         teams {
           edges {
             node {
               name
             }
           }
         }
      }
    `
  }
});
