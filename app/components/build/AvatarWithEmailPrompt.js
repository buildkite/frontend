import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import AnchoredPopover from '../shared/Popover/anchored';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import EmailResendVerificationMutation from '../../mutations/EmailResendVerification';
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
              id: React.PropTypes.string,
              address: React.PropTypes.string,
              verified: React.PropTypes.bool
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
    isAddingEmail: false,
    isSendingVerification: false,
    hasSentSomething: false,
    hasBeenDismissed: false
  };

  getUserEmail(email) {
    const userEmails = this.props.viewer.emails.edges;

    const userEmail = userEmails.find(
      ({ node: { address: userEmail } }) => (
        userEmail.toLowerCase() === email.toLowerCase()
      )
    );

    if (userEmail) {
      return userEmail.node;
    }
  }

  isCurrentUsersValidatedEmail(email) {
    const userEmail = this.getUserEmail(email);
    return userEmail && userEmail.verified;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentWillReceiveProps(nextProps) {
    const { createdBy } = nextProps.build;

    if (createdBy && createdBy.email && !this.isCurrentUsersValidatedEmail(createdBy.email)) {
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

    const mutation = new EmailCreateMutation({ address: this.props.build.createdBy.email, viewer: this.props.viewer });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleEmailAddedSuccess, onFailure: this.handleMutationFailure });
  };

  handleResendVerificationClick = () => {
    this.setState({ isSendingVerification: true });

    const mutation = new EmailResendVerificationMutation({ email: this.getUserEmail(this.props.build.createdBy.email) });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleVerificationResentSuccess, onFailure: this.handleMutationFailure });
  };

  handleEmailAddedSuccess = () => {
    this.setState({ isAddingEmail: false, hasSentSomething: true });
  };

  handleVerificationResentSuccess = () => {
    this.setState({ isSendingVerification: false, hasSentSomething: true });
  };

  handleLocalDismissClick = () => {
    this.setState({ hasBeenDismissed: true });
  }

  renderContent() {
    const {
      build: {
        createdBy: {
          email
        }
      },
      relay: {
        variables: {
          isTryingToPrompt
        }
      },
      viewer: {
        notice
      }
    } = this.props;
    const { isAddingEmail, isSendingVerification, hasBeenDismissed, hasSentSomething } = this.state;
    const wrapperClassName = 'center px3 py2';

    // There won't be an email address if this build was created by a
    // registered user or if this build just has no owner (perhaps it was
    // created by Buildkite)
    if (!email) {
      return null;
    }

    // If we haven't decided to send a query for this yet, don't show anything!
    if (!isTryingToPrompt) {
      return null;
    }

    // If the user has seen the notice and has been dismissed
    if (notice && notice.dismissedAt) {
      return null;
    }

    // If the user has dismissed this notice instance
    if (hasBeenDismissed) {
      return null;
    }

    if (isAddingEmail || isSendingVerification) {
      return (
        <div
          className={wrapperClassName}
          style={{
            paddingTop: 76,
            paddingBottom: 77
          }}
        >
          <Spinner />
          <p className="h5 mb0">
            {isSendingVerification ? 'Resending verification email…' : 'Adding Email…'}
          </p>
        </div>
      );
    }

    const userEmail = this.getUserEmail(email);

    if (userEmail) {
      if (userEmail.verified) {
        return null;
      }

      if (hasSentSomething) {
        return (
          <div className={wrapperClassName}>
            <p className="h5 mt0">
              Verify your email
            </p>
            <p className="my2">
              We’ve sent a verification link to {email}. Click the link to add the email to your account.
            </p>
            <Button
              className="block mt2"
              theme="default"
              outline={true}
              style={{ width: '100%' }}
              onClick={this.handleLocalDismissClick}
            >
              Dismiss
            </Button>
          </div>
        );
      }

      return (
        <div className={wrapperClassName}>
          <p className="h5 mt0">
            Email awaiting verification
          </p>
          <p className="my2">
            We’ve sent a verification link to {email}. Click the link to add the email to your account.<br />
            If it hasn’t arrived, you can resend it from here!
          </p>
          <Button
            className="block mt2"
            theme="default"
            outline={true}
            style={{ width: '100%' }}
            onClick={this.handleResendVerificationClick}
          >
            Resend Verification Email
          </Button>
        </div>
      );
    }

    // Otherwise, we've got an unknown (to Buildkite) email address on our hands!
    return (
      <div className={wrapperClassName}>
        <p className="h5 mt0">
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
          alwaysShow={true}
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
        ${EmailCreateMutation.getFragment('viewer')}
        emails(first: 50) {
          edges {
            node {
              id
              address
              verified
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
