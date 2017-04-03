import React from 'react';
import Relay from 'react-relay';

import Dropdown from '../shared/Dropdown';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class AvatarWithUnknownEmailPrompt extends React.PureComponent {
  static propTypes = {
    build: React.PropTypes.shape({
      createdBy: React.PropTypes.shape({
        email: React.PropTypes.string,
        name: React.PropTypes.string
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
    isDismissing: false,
    hasSentSomething: false,
    hasBeenDismissed: false
  };

  // Given an email address, try and return the associated UserEmail GraphQL
  // node
  findUserEmailNode(email) {
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

  // Given an email address, returns true/false depending on whether or not the
  // current user owns that email and it's been verified
  isCurrentUsersValidatedEmail(email) {
    const userEmail = this.findUserEmailNode(email);

    return userEmail && userEmail.verified;
  }

  // Determines if this paticular build should prompt the current user to add
  // it's associated email to their user account
  isUnregisteredWithEmail(createdBy) {
    return (createdBy && createdBy.email && createdBy.__typename === "UnregisteredUser");
  }

  componentDidMount() {
    const createdBy = this.props.build.createdBy;

    // Before showing the prompt, we should first check to see if we even
    // should. The first check `isUnregisteredWithEmail` makes sure that the
    // associated user on this build is not a Buildkite user and has an email
    // we can link to.
    //
    // The second check makes sure that the user hasn't already added and
    // verified the email, but is waiting for Buildkite's backend to link the
    // user to the build.
    if (this.isUnregisteredWithEmail(createdBy) && !this.isCurrentUsersValidatedEmail(createdBy.email)) {
      this.props.relay.setVariables(
        {
          isTryingToPrompt: true,
          emailForPrompt: createdBy.email.toLowerCase()
        },
        (readyState) => {
          if (readyState.done) {
            setTimeout(() => {
              const { dismissedAt } = this.props.viewer.notice;

              if (this._dropdown && !dismissedAt) {
                this._dropdown.setShowing(true);
              }
            }, 0);
          }
        }
      );
    }
  }

  getMessages(loading) {
    // If we haven't decided to send a query for this yet, don't show anything!
    if (!this.props.relay.variables.isTryingToPrompt) {
      return {};
    }

    let message;
    let buttons;

    const userEmail = this.findUserEmailNode(this.props.build.createdBy.email);

    if (!this.state.isAddingEmail && userEmail) {
      if (userEmail.verified) {
        return {};
      }

      message = (
        <div>
          <h1 className="h5 m0 mb1 bold">Email verification needed</h1>
          <p>We’ve sent a verification email to <strong className="semi-bold">{this.props.build.createdBy.email}</strong>. Click the link in that email to finish adding it to your account.</p>
          <p className="dark-gray mt0 dark-gray m0 h7">You can resend the verification email or remove this email address in your <a className="semi-bold lime hover-lime hover-underline" href="/user/emails">Personal Email Settings</a></p>
        </div>
      );
    } else {
      // Otherwise, we've got an unknown (to Buildkite) email address on our hands!
      message = (
        <div>
          <h1 className="h5 m0 mb1 bold">Unknown build commit email</h1>
          <p className="m0">The email <strong className="semi-bold">{this.props.build.createdBy.email}</strong> could not be matched to any users in your organization. If this email address belongs to you, add it to your personal list of email addresses.</p>
        </div>
      );
      buttons = [
        <button
          key="add-email"
          className="btn btn-primary flex-auto m1"
          onClick={this.handleAddEmailClick}
          disabled={loading}
        >
          Add Email Address
        </button>,
        <button
          key="dismiss-email"
          className="btn btn-outline border-gray flex-auto m1"
          onClick={this.handleDismissClick}
          disabled={loading}
        >
          Not My Email Address
        </button>
      ];
    }

    return { message, buttons, loading };
  }

  isLoading = () => (
    this.state.isAddingEmail || this.state.isDismissing
  );

  render() {
    const loading = this.isLoading();

    const { message, buttons } = this.getMessages(loading);
    let buttonContent;

    if (buttons) {
      buttonContent = (
        <div className="mx4 mt2 my3 flex items-center">
          <div className="no-flex mr2 center" style={{ width: 32 }}>
            {loading && <Spinner />}
          </div>
          <div
            className="flex flex-auto flex-wrap"
            style={{ margin: -5 }}
          >
            {buttons}
          </div>
        </div>
      );
    }

    if (message) {
      return (
        <div>
          <Dropdown
            width={440}
            ref={(dropdown) => this._dropdown = dropdown}
            offsetY={8}
          >
            <UserAvatar user={this.props.build.createdBy} style={{ width: 32, height: 32 }} className="cursor-pointer" />
            <div className="flex items-top mx4 mt3 mb2">
              <div className="no-flex mr2 center lime" style={{ marginTop: 2 }}>
                <Icon icon="unknown-user" title="Unknown build email" style={{ width: 32, height: 32 }} />
              </div>
              <span className="line-height-3">{message}</span>
            </div>
            {buttonContent}
          </Dropdown>
        </div>
      );
    }

    return (
      <div>
        <UserAvatar
          user={this.props.build.createdBy}
          style={{ width: 32, height: 32, border: '1px solid #ccc', background: 'white' }}
        />
      </div>
    );
  }

  handleMutationFailure = (transaction) => {
    this.setState({ isAddingEmail: false, isDismissing: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };

  handleDismissClick = () => {
    this.setState({ isDismissing: true });

    const mutation = new NoticeDismissMutation({ viewer: this.props.viewer, notice: this.props.viewer.notice });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleDismissedSucess, onFailure: this.handleMutationFailure });

    this._dropdown.setShowing(false);
  };

  handleAddEmailClick = () => {
    this.setState({ isAddingEmail: true });

    const mutation = new EmailCreateMutation({ address: this.props.build.createdBy.email, viewer: this.props.viewer });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleEmailAddedSuccess, onFailure: this.handleMutationFailure });
  };

  handleDismissedSucess = () => {
    this.setState({ isDismissing: false });
  };

  handleEmailAddedSuccess = () => {
    this.setState({ isAddingEmail: false, hasSentSomething: true });
  };

  handleLocalDismissClick = () => {
    this.setState({ hasBeenDismissed: true });
  }
}

export default Relay.createContainer(AvatarWithUnknownEmailPrompt, {
  initialVariables: {
    emailForPrompt: null,
    isTryingToPrompt: false
  },

  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        createdBy {
          __typename
          ...on UnregisteredUser {
            name
            email
            avatar {
              url
            }
          }
          ...on User {
            name
            email
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
        notice(namespace: EMAIL_SUGGESTION, scope: $emailForPrompt) @include(if: $isTryingToPrompt) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
