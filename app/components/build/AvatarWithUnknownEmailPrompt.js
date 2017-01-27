import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Dropdown from '../shared/Dropdown';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';

import FlashesStore from '../../stores/FlashesStore';

import EmailCreateMutation from '../../mutations/EmailCreate';
import EmailResendVerificationMutation from '../../mutations/EmailResendVerification';
import NoticeDismissMutation from '../../mutations/NoticeDismiss';

class AvatarWithUnknownEmailPrompt extends React.Component {
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

  handleMutationFailure = (transaction) => {
    this.setState({ isAddingEmail: false, isDismissing: false, isSendingVerification: false });

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
      }
    } = this.props;
    const { isAddingEmail, isSendingVerification, hasSentSomething } = this.state;

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

    let message;
    let buttons;

    const userEmail = this.getUserEmail(email);

    if (!isAddingEmail && userEmail) {
      if (userEmail.verified) {
        return {};
      }

      message = (
        <div>
          <h1 className="h5 m0 mb1 bold">Email verification needed</h1>
          <p>We’ve sent a verification email to <strong className="semi-bold">{email}</strong>. Click the link in that email to finish adding it to your account.</p>
          <p className="dark-gray mt0 dark-gray m0 h7">You can resend the verification email or remove this email address in your <a className="semi-bold lime hover-lime hover-underline" href="/user/emails">Personal Email Settings</a></p>
        </div>
      );

      if (isSendingVerification || !hasSentSomething) {
        message = (
          <div>
            <h1 className="h5 m0 mb1 bold">Email verification needed</h1>
            <p>Please click the link in the verification email we sent to <strong className="semi-bold">{email}</strong>.</p>
            <p className="dark-gray mt0 dark-gray m0 h7">You can resend the verification email or remove this email address in your <a className="semi-bold lime hover-lime hover-underline" href="/user/emails">Personal Email Settings</a></p>
          </div>
        );
      }
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
    this.state.isAddingEmail || this.state.isDismissing || this.state.isSendingVerification
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
          >
            <UserAvatar user={this.props.build.createdBy} style={{ width: 32, height: 32 }} className="cursor-pointer" />
            <div className="flex items-top mx4 mt3 mb2">
              <div className="no-flex mr2 center lime" style={{ marginTop: 2 }}>
                <svg width="32px" height="32px" viewBox="-1 -1 32 32">
                  <circle stroke="currentColor" strokeWidth="2" fill="none" cx="15" cy="15" r="15" />
                  <path d="M10.9643555,11.7773438 L13.1445312,11.7773438 C13.1816408,11.2021456 13.3826479,10.7444678 13.7475586,10.4042969 C14.1124693,10.0641259 14.5917939,9.89404297 15.1855469,9.89404297 C15.7731149,9.89404297 16.2447085,10.0548487 16.6003418,10.3764648 C16.9559751,10.698081 17.1337891,11.1031877 17.1337891,11.5917969 C17.1337891,12.0494815 17.0209158,12.4298487 16.795166,12.7329102 C16.5694162,13.0359716 16.1689482,13.3606754 15.59375,13.7070312 C14.9567025,14.0843118 14.4974786,14.5002419 14.2160645,14.954834 C13.9346503,15.4094261 13.8155922,15.9830695 13.8588867,16.6757812 L13.8681641,17.3251953 L16.0205078,17.3251953 L16.0205078,16.7871094 C16.0205078,16.3232399 16.1287424,15.9428726 16.3452148,15.6459961 C16.5616873,15.3491196 16.9729787,15.0244158 17.5791016,14.671875 C18.2099641,14.2945945 18.6954736,13.8508326 19.0356445,13.3405762 C19.3758155,12.8303197 19.5458984,12.2195674 19.5458984,11.5083008 C19.5458984,10.4816029 19.1562539,9.64046552 18.3769531,8.98486328 C17.5976524,8.32926104 16.5740623,8.00146484 15.3061523,8.00146484 C13.9269137,8.00146484 12.8677609,8.35863901 12.1286621,9.07299805 C11.3895634,9.78735709 11.001465,10.6887966 10.9643555,11.7773438 Z M15.0556641,21.7319336 C15.5195336,21.7319336 15.8906236,21.6005059 16.1689453,21.3376465 C16.447267,21.0747871 16.5864258,20.7207054 16.5864258,20.2753906 C16.5864258,19.8300759 16.447267,19.4744479 16.1689453,19.2084961 C15.8906236,18.9425442 15.5195336,18.8095703 15.0556641,18.8095703 C14.5856096,18.8095703 14.209881,18.9425442 13.9284668,19.2084961 C13.6470526,19.4744479 13.5063477,19.8300759 13.5063477,20.2753906 C13.5063477,20.7207054 13.6470526,21.0747871 13.9284668,21.3376465 C14.209881,21.6005059 14.5856096,21.7319336 15.0556641,21.7319336 Z" stroke="none" fill="currentColor" fillRule="evenodd" />
                </svg>
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
        notice(namespace: NOTICE_NAMESPACE_EMAIL_SUGGESTION, scope: $emailForPrompt) @include(if: $isTryingToPrompt) {
          ${NoticeDismissMutation.getFragment('notice')}
          dismissedAt
        }
      }
    `
  }
});
