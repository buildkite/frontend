import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../shared/Button';
import Spinner from '../shared/Spinner';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class EmailPrompt extends React.Component {
  static propTypes = {
    build: React.PropTypes.shape({
      createdBy: React.PropTypes.shape({
        email: React.PropTypes.string
      })
    }).isRequired,
    viewer: React.PropTypes.shape({
      notice: React.PropTypes.shape({
        dismissedAt: React.PropTypes.string
      })
    }).isRequired
  };

  state = {
    isAddingEmail: false
  };

  isCurrentUsersEmail(email) {
    const userEmails = this.props.viewer.emails.edges;

    return userEmails.some(
      ({ node: { address: userEmail } }) => (
        userEmail.toLowerCase() === email.toLowerCase()
      )
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    const { createdBy } = nextProps.build;

    if (createdBy && createdBy.email && !this.isCurrentUsersEmail(createdBy.email)) {
      this.props.relay.setVariables({
        isTryingToPrompt: true,
        emailForPrompt: createdBy.email.toLowerCase()
      });
    }
  }

  handleDismissClick = () => {
    const mutation = new NoticeDismissMutation({ notice: this.props.viewer.notice });

    Relay.Store.commitUpdate(mutation, { onFailure: this.handleMutationFailure });
  };

  handleMutationFailure = (transaction) => {
    this.setState({ isAddingEmail: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };

  handleAddEmailClick = () => {
    this.setState({ isAddingEmail: true });

    const mutation = new EmailCreateMutation({ address: this.props.build.createdBy.email });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleEmailAddedSuccess, onFailure: this.handleMutationFailure });
  };

  handleEmailAddedSuccess = (transaction) => {
    this.setState({ isAddingEmail: false });
  };

  render() {
    const emails = this.props.viewer.emails.edges;
    const { email = "error@example.ca" } = this.props.build.createdBy;
    const notice = this.props.viewer.notice;

    // if the build has no email (this shouldn't happen???)
    if (!email) {
      return null;
    }

    // if the user has seen the notice and has been dismissed
    if (notice && notice.dismissedAt) {
      return null;
    }

    if (this.state.isAddingEmail) {
      return (
        <div className="center">
          <Spinner />
          <p className="h5">
            Adding Email…
          </p>
        </div>
      );
    }

    if (this.isCurrentUsersEmail(email)) {
      return (
        <div className="center">
          <p className="h4">
            Verify your email
          </p>
          <p className="my2">
            We've sent a verification link to {email}. Click the link to add the email to your account.
          </p>
          {/* TODO: "Resend Verification Email" */}
        </div>
      );
    }

    return (
      <div className="center">
        <p className="h4">
          Unknown email address
        </p>
        <p className="my2">
          If {email} is your email address, add it to your account to have builds appear in My Builds, customize your email settings, and more. <a className="semi-bold lime hover-lime text-decoration-none hover-underline" href="/docs/account/email">Learn more</a>
        </p>
        <Button
          className="block my2"
          style={{ width: '100%' }}
          onClick={this.handleAddEmailClick}
        >
          Add {email}
        </Button>
        <Button
          className="block"
          theme="default"
          outline={true}
          style={{ width: '100%' }}
          onClick={this.handleDismissClick}
        >
          Dismiss
        </Button>
      </div>
    );
  }
}

export default Relay.createContainer(EmailPrompt, {
  initialVariables: {
    emailForPrompt: null,
    isTryingToPrompt: false
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
        notice(namespace: NOTICE_NAMESPACE_EMAIL_SUGGESTION, scope: $emailForPrompt) @include(if: $isTryingToPrompt) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
