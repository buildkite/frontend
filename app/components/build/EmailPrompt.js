import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class EmailPrompt extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      emails: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              address: React.PropTypes.string.isRequired
            }).isRequired
          })
        )
      }).isRequired
    }).isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.build.createdBy && nextProps.build.createdBy.email) {
      this.props.relay.setVariables({ authorEmail: nextProps.build.createdBy.email });
    }
  }

  render() {
    const emails = this.props.viewer.emails.edges;
    const author = this.props.build.createdBy;

    if (!author.email) {
      return null;
    }

    return (
      <div>
        <h2>Email Prompt</h2>
        <ul>
          {emails.map(({ node: email }) => <li>{email.address}</li>)}
        </ul>
        <code>{JSON.stringify(this.props.build)}</code>
      </div>
    );
  }
}

export default Relay.createContainer(EmailPrompt, {
  initialVariables: {
    authorEmail: null
  },

  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        createdBy {
          ...on UnregisteredUser {
            email
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        emails(first: 50) {
          edges {
            node {
              address
            }
          }
        }
        notice(namespace: NOTICE_NAMESPACE_EMAIL_SUGGESTION, scope: $authorEmail) @include(if: $authorEmail) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
