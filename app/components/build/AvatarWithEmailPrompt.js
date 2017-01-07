import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import AnchoredPopover from '../shared/Popover/anchored';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class AvatarWithEmailPrompt extends React.Component {
  static propTypes = {
    build: React.PropTypes.shape({
      createdBy: React.PropTypes.shape({
        email: React.PropTypes.string
      })
    }).isRequired,
    viewer: React.PropTypes.shape({
      emails: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              address: React.PropTypes.string
            })
          })
        )
      }).isRequired,
      notice: React.PropTypes.shape({
        dismissedAt: React.PropTypes.string
      })
    }).isRequired,
    relay: React.PropTypes.object
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
    const mutation = new NoticeDismissMutation({ viewer: this.props.viewer, notice: this.props.viewer.notice });

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

  handleEmailAddedSuccess = () => {
    this.setState({ isAddingEmail: false });
  };

  renderContent() {
    const { email } = this.props.build.createdBy;
    const notice = this.props.viewer.notice;

    // There won't be an email address if this build was created by a
    // registered user or if this build just has no owner (perhaps it was
    // created by Buildkite)
    if (!email) {
      return null;
    }

    // If the user has seen the notice and has been dismissed
    if (notice && notice.dismissedAt) {
      return null;
    }

    if (this.state.isAddingEmail) {
      return (
        <div className="center px3 py2">
          <Spinner />
          <p className="h5">
            Adding Email…
          </p>
        </div>
      );
    }

    if (this.isCurrentUsersEmail(email)) {
      return (
        <div className="center px3 py2">
          <p className="h4 mt0">
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
      <div className="center px3 py2">
        <p className="h4 mt0">
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

  render() {
    const { build } = this.props;

    const avatar = (
      <UserAvatar
        user={build.createdBy}
        style={{ width: 32, height: 32 }}
      />
    );

    const content = this.renderContent();

    if (content) {
      return (
        <AnchoredPopover
          alwaysShow
          width={400}
        >
          {avatar}
          {content}
        </AnchoredPopover>
      );
    }

    return avatar;
  }
}

export default Relay.createContainer(AvatarWithEmailPrompt, {
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
            name
            avatar {
              url
            }
          }
          ...on User {
            name
            avatar {
              url
            }
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
