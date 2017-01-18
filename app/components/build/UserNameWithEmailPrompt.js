import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Dropdown from '../shared/Dropdown';
import Media from '../shared/Media';
import Spinner from '../shared/Spinner';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import EmailResendVerificationMutation from '../../mutations/EmailResendVerification';
import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class UserNameWithEmailPrompt extends React.Component {
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

  componentDidMount() {
    const { createdBy } = this.props.build;

    if (createdBy && createdBy.email && !this.isCurrentUsersValidatedEmail(createdBy.email)) {
      this.props.relay.setVariables({
        isTryingToPrompt: true,
        emailForPrompt: createdBy.email.toLowerCase()
      });
    }
  }

  handleMutationFailure = (transaction) => {
    this.setState({ isAddingEmail: false, isDismissing: false, isSendingVerification: false });

    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };

  handleDismissClick = () => {
    this.setState({ isDismissing: true });

    const mutation = new NoticeDismissMutation({ viewer: this.props.viewer, notice: this.props.viewer.notice });

    Relay.Store.commitUpdate(mutation, { onSuccess: this.handleDismissedSucess, onFailure: this.handleMutationFailure });
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

  handleDismissedSucess = () => {
    this.setState({ isDismissing: false });
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

  getMessages(loading) {
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

    // There won't be an email address if this build was created by a
    // registered user or if this build just has no owner (perhaps it was
    // created by Buildkite)
    if (!email) {
      return {};
    }

    // If we haven't decided to send a query for this yet, don't show anything!
    if (!isTryingToPrompt) {
      return {};
    }

    // If the user has seen the notice and has been dismissed
    if (notice && notice.dismissedAt) {
      return {};
    }

    // If the user has dismissed this notice instance
    if (hasBeenDismissed) {
      return {};
    }

    let message;
    let buttons;

    const userEmail = this.getUserEmail(email);

    if (!isAddingEmail && userEmail) {
      if (userEmail.verified) {
        return {};
      }

      message = (
        <Media.Description>
          Almost done! <strong>Click the verification link</strong> we’ve sent to {email} to finish adding this email to your account.
        </Media.Description>
      );

      if (isSendingVerification || !hasSentSomething) {
        message = (
          <Media.Description>
            Verify this email to finish adding it to your account and take ownership of this build.
          </Media.Description>
        );
      }
    } else {
      // Otherwise, we've got an unknown (to Buildkite) email address on our hands!
      message = (
        <Media.Description>
          <h1 className="h5 m0 mb1 bold">{this.props.build.createdBy.email}</h1>
          <p className="m0">This build author’s email address couldn’t be matched to a Buildkite user. If this address belongs to you, add it to your account below to take ownership of these builds.</p>
        </Media.Description>
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
    this.state.isAddingEmail || this.state.isDismissing || this.state.isSendingVerification
  );

  render() {
    const { build: { createdBy: creator } } = this.props;
    const loading = this.isLoading();

    const creatorIdentity = creator.name || creator.email;

    const { message, buttons } = this.getMessages(loading);
    let buttonContent;

    if (buttons) {
      buttonContent = (
        <Media className="mx4 mt2 my3" style={{ marginTop: -5 }}>
          <Media.Image className="mr2 center" style={{ width: 32 }}>
            {loading && <Spinner />}
          </Media.Image>
          <Media.Description
            className="flex flex-auto flex-wrap"
            style={{ margin: -5 }}
          >
            {buttons}
          </Media.Description>
        </Media>
      );
    }

    if (message) {
      return (
        <div>
          <Dropdown
            width={460}
          >
            <span>
              <svg
                className="cursor-pointer"
                style={{
                  color: '#7eaf25',
                  width: '1.25em',
                  height: '1.25em',
                  margin: '-.175em',
                  verticalAlign: '-.15em'
                }}
              >
                <circle
                  cx="50%"
                  cy="50%"
                  r="25%"
                  stroke="currentColor"
                  strokeWidth="7%"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="25%"
                  stroke="currentColor"
                  strokeWidth="7%"
                  fill="none"
                >
                  <animate
                    attributeName="r"
                    begin="2s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="25%;25%;45%"
                  />
                  <animate
                    attributeName="opacity"
                    begin="2s"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="0;1;.6;.6;0"
                  />
                </circle>
                <circle
                  cx="50%"
                  cy="50%"
                  r="15%"
                  fill="currentColor"
                />
              </svg>
            </span>
            <Media align="top" className="mx4 my3">
              <Media.Image className="mr2 center">
                <svg width="32px" height="32px" viewBox="0 0 32 32" version="1.1">
                  <g transform="translate(1, 1)" fill="none" strokeWidth="2" stroke="#7EAF25">
                    <ellipse cx="15" cy="15" rx="15" ry="15" />
                    <rect x="7" y="9" width="16" height="12" rx="2" />
                    <polyline points="7 9 15 15 23 9.00146484" />
                  </g>
                </svg>
              </Media.Image>
              {message}
            </Media>
            {buttonContent}
            <Media className="mx4 my3">
              <Media.Image className="mr2 center" style={{ width: 32 }} />
              <Media.Description className="dark-gray mt0"><a className="semi-bold lime hover-lime hover-underline" href="/user/emails">Personal email settings</a></Media.Description>
            </Media>
          </Dropdown>
          {` ${creatorIdentity}`}
        </div>
      );
    }

    return (
      <div>
        {creatorIdentity}
      </div>
    );
  }
}

export default Relay.createContainer(UserNameWithEmailPrompt, {
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
          ...on User {
            name
            email
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
