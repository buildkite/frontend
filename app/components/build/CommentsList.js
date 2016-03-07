import React from 'react';
import Relay from 'react-relay';

class CommentsList extends React.Component {
  render() {
    return (
      <span>Comments</span>
    );
  }
}

export default Relay.createContainer(CommentsList, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
         user {
           name
         }
      }
    `,
    build: () => Relay.QL`
      fragment on Build {
         id
      }
    `
  }
});
