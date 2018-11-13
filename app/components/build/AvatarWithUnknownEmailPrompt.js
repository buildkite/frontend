import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import Button from 'app/components/shared/Button';
import Dropdown from 'app/components/shared/Dropdown';
import Icon from 'app/components/shared/Icon';
import Spinner from 'app/components/shared/Spinner';
import UserAvatar from 'app/components/shared/UserAvatar';

import FlashesStore from 'app/stores/FlashesStore';

import EmailCreateMutation from 'app/mutations/EmailCreate';
import NoticeDismissMutation from 'app/mutations/NoticeDismiss';

class AvatarWithUnknownEmailPrompt extends React.PureComponent {
  static propTypes = {
    build: PropTypes.shape({
      createdBy: PropTypes.shape({
        email: PropTypes.string,
        name: PropTypes.string
      })
    }).isRequired,
    viewer: PropTypes.shape({
      emails: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              id: PropTypes.string,
              address: PropTypes.string,
              verified: PropTypes.bool
            })
          })
        )
      }).isRequired,
      githubAuthorizations: PropTypes.shape({
        count: PropTypes.number.isRequired
      }).isRequired,
      notice: PropTypes.shape({
        dismissedAt: PropTypes.string
      })
    }).isRequired,
    relay: PropTypes.object
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

  // Given an email address, returns whether it
  // is a private GitHub address
  isPrivateGitHubAddress(email) {
    return email.endsWith('@users.noreply.github.com');
  }

  // Determines if this paticular build should prompt the current user to add
  // it's associated email to their user account
  isUnregisteredCreatorWithEmail(createdBy) {
    return (createdBy && createdBy.email && createdBy.__typename === "UnregisteredUser");
  }

  componentDidMount() {
    const createdBy = this.props.build.createdBy;

    // Before showing the prompt, we first check to see if we even should.
    //
    // Make sure that the associated user on this build is not a Buildkite user
    // and has an email we can link to.
    if (this.isUnregisteredCreatorWithEmail(createdBy)) {
      // Make sure that if this is a private  GitHub email address, we don't
      // prompt the user about it unless they have no GitHub account authorized
      if (this.isPrivateGitHubAddress(createdBy.email)) {
        if (this.props.viewer.githubAuthorizations.count) {
          return;
        }
      }

      // Ensure that the user hasn't already added and verified the email, but
      // is waiting for Buildkite's backend to link the user to the build.
      if (this.isCurrentUsersValidatedEmail(createdBy.email)) {
        return;
      }

      // Otherwise, query the backend to see if this user has already dismissed
      // notices about this build's associated email address
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

    const { email: authorEmail } = this.props.build.createdBy;

    let message;
    let buttons;

    const matchingUserEmail = this.findUserEmailNode(authorEmail);

    if (!this.state.isAddingEmail && matchingUserEmail) {
      if (matchingUserEmail.verified) {
        return {};
      }

      message = (
        <div>
          <h1 className="h4 m0 mb1 bold">Email verification needed</h1>
          <p>We’ve sent a verification email to <strong className="semi-bold">{authorEmail}</strong>. Click the link in that email to finish adding it to your account.</p>
          <p className="dark-gray mt0 dark-gray m0 h7">You can resend the verification email or remove this email address in your <a className="semi-bold lime hover-lime hover-underline" href="/user/emails">Personal Email Settings</a></p>
        </div>
      );
    } else {
      // Otherwise, we've got an unknown (to Buildkite) email address on our hands!
      if (this.isPrivateGitHubAddress(authorEmail)) {
        // If this is a GitHub-generated private email address (https://git.io/jinr),
        // let's prompt the user to connect their account!
        //
        // NOTE: `handleDismissClick` works the same for GitHub or non-GitHub emails!
        message = (
          <div>
            <h1 className="h4 m0 mb1 bold">Unknown GitHub account</h1>
            <p className="m0">
              The GitHub account <strong className="semi-bold">{authorEmail.split('@').shift()}</strong> could not be matched to any users in your organization. If this GitHub account belongs to you, connect it to your Buildkite account.
            </p>
          </div>
        );
        buttons = [
          <Button
            key="manage-apps"
            theme="primary"
            className="center flex-auto m1"
            href="/user/connected-apps"
            loading={loading && "Connect GitHub Account"}
          >
            Connect GitHub Account
          </Button>,
          <button
            key="dismiss-github"
            className="btn btn-outline border-gray flex-auto m1"
            onClick={this.handleDismissClick}
            disabled={loading}
          >
            Not My Account
          </button>
        ];
      } else {
        // Otherwise, this is just an email address, let's prompt them to add it!
        message = (
          <div>
            <h1 className="h4 m0 mb1 bold">Unknown build commit email</h1>
            <p className="m0">
              The email <strong className="semi-bold">{authorEmail}</strong> could not be matched to any users in your organization. If this email address belongs to you, add it to your personal list of email addresses.
            </p>
          </div>
        );
        buttons = [
          <button
            key="add-email"
            className="btn btn-primary flex-auto m1"
            onClick={this.handleAddEmailClick}
            disabled={loading}
          >
            It’s Mine
          </button>,
          <button
            key="dismiss-email"
            className="btn btn-outline border-gray flex-auto m1"
            onClick={this.handleDismissClick}
            disabled={loading}
          >
            Not Mine
          </button>
        ];
      }
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
        githubAuthorizations: authorizations(type: GITHUB) {
          count
        }
        notice(namespace: EMAIL_SUGGESTION, scope: $emailForPrompt) @include(if: $isTryingToPrompt) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
