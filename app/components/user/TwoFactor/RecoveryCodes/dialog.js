// @flow

import * as React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import GraphQLErrors from '../../../../constants/GraphQLErrors';

import Button from '../../../shared/Button';
import Dialog from '../../../shared/Dialog';
import RecoveryCodeList from '../../../RecoveryCodeList';

type Props = {
  isOpen: boolean,
  onRequestClose: Function,
  totp: ?{
    id: string,
    recoveryCodes: ?{
      codes: Array<string>
    }
  },
  relay: Object
};

type State = {
  generatingRecoveryCodes: boolean,
  generatedRecoveryCodes: boolean,
  activatedRecoveryCodes: boolean,
  recoveryCodes: ?{
    id: string,
    codes: Array<string>
  }
};

type RecoveryCodesCreateReturnType = {
  recoveryCodesCreate: {
    recoveryCodes: {
      id: string,
      codes: Array<string>
    }
  }
};

class RecoveryCodesDialog extends React.PureComponent<Props, State> {
  state = {
    generatingRecoveryCodes: false,
    generatedRecoveryCodes: false,
    activatedRecoveryCodes: false,
    recoveryCodes: null
  };

  render() {
    if (!this.props.totp) {
      return null;
    }

    let content;

    if (!this.props.totp.recoveryCodes) {
      if (this.state.generatingRecoveryCodes) {
        content = (
          <React.Fragment>
            <h2 className="m0 h2 semi-bold mb3">Generating Recovery Codes</h2>

            <p>Please wait, weʼre getting some recovery codes ready for you.</p>
          </React.Fragment>
        );
      } else if (this.state.generatedRecoveryCodes && this.state.recoveryCodes) {
        content = (
          <React.Fragment>
            <h2 className="m0 h2 semi-bold mb3">Generated Recovery Codes</h2>

            <RecoveryCodeList recoveryCodes={this.state.recoveryCodes} />

            <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>

            <CopyToClipboard
              text={this.state.recoveryCodes.codes.join('\n')}
              onCopy={this.handleRecoveryCodeCopy}
            >
              <Button
                className="col-12"
                theme="success"
                outline={true}
              >
                Copy Recovery Codes
              </Button>
            </CopyToClipboard>
          </React.Fragment>
        );
      }
    } else if (this.props.totp.recoveryCodes) {
      content = (
        <React.Fragment>
          <h2 className="m0 h2 semi-bold mb3">Current Recovery Codes</h2>

          <p>Recovery codes are used if you lose access to your code generator.</p>

          <RecoveryCodeList recoveryCodes={this.props.totp.recoveryCodes} />

          <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>

          <CopyToClipboard
            text={this.props.totp.recoveryCodes.codes.join('\n')}
            onCopy={this.handleRecoveryCodeCopy}
          >
            <Button
              className="col-12"
              theme="success"
              outline={true}
            >
              Copy Recovery Codes
            </Button>
          </CopyToClipboard>
        </React.Fragment>
      );
    }

    return (
      <Dialog
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        width={420}
      >
        <div className="p4">
          {content}
        </div>
      </Dialog>
    );
  }

  componentDidMount() {
    // If we have a TOTP, but no recovery codes for it,
    if (this.props.totp && !this.props.totp.recoveryCodes) {
      // immediately go generate a token
      this.generateRecoveryCodes();
    }
  }

  generateRecoveryCodes() {
    if (!this.props.totp) {
      throw new Error("that shouldn't happen, what?!");
    }

    const recoverableId = this.props.totp.id;

    this.setState({ generatingRecoveryCodes: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation dialogCreateMutation($input: RecoveryCodesCreateInput!) {
            recoveryCodesCreate(input: $input) {
              clientMutationId
              recoveryCodes {
                ...RecoveryCodeList_recoveryCodes
                id
                codes
              }
            }
          }
        `,
        variables: { input: { recoverableId } },
        onCompleted: this.handleCreateMutationComplete,
        onError: this.handleCreateMutationError
      });
    });
  }

  componentWillUnmount() {
    // When unmounting, if we haven't finished activating, try to delete the TOTP record
    if (this.state.recoveryCodes && this.state.generatedRecoveryCodes && !this.state.activatedRecoveryCodes) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation dialogDeleteMutation($input: RecoveryCodesDeleteInput!) {
            recoveryCodesDelete(input: $input) {
              clientMutationId
            }
          }
        `,
        variables: { input: { id: this.state.recoveryCodes.id } }
      });
    }
  }

  handleCreateMutationComplete = (mutationResult: RecoveryCodesCreateReturnType) => {
    this.setState({
      generatingRecoveryCodes: false,
      generatedRecoveryCodes: true,
      activatedRecoveryCodes: false,
      recoveryCodes: mutationResult.recoveryCodesCreate.recoveryCodes
    });
  };

  handleCreateMutationError = (error) => {
    if (error && error.source) {
      switch (error.source.type) {
        case GraphQLErrors.ERROR:
          // TODO: Sorry, this check sucks, I know, but it's temporary until we don't have any users under classic SSO rules - Jessica, July '18
          // If we get an SSO-related error back, something's gone weird (a user shouldn't be able to get here under those circumstances) but I'm handling it just in case.
          if (error.source.errors && error.source.errors[0] && error.source.errors[0].message && error.source.errors[0].message === 'TOTP configuration is not available to SSO users') {
            // Show an alert (the backend handling would show a similar flash, but I decided this was better than allowing for a potential infinite loop)
            alert([
              'You currently use Buildkite via Single Sign-On.',
              'Two-factor authentication cannot be enabled on your account until you reset your password.',
              'Weʼll take you back to your personal settings.'
            ].join('\n\n'));
            location.assign('/user/settings');
            return;
          }
          break;

        case GraphQLErrors.ESCALATION_ERROR:
          // Reload the page so that the backend can prompt to escalate the current session for us
          location.reload();
          return;

        default:
          break;
      }
    }

    alert(error);
  };

  handleRecoveryCodeCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
    }
  }
}

export default createFragmentContainer(RecoveryCodesDialog, {
  totp: graphql`
    fragment dialog_totp on TOTP {
      id
      recoveryCodes {
        ...RecoveryCodeList_recoveryCodes
        codes
      }
    }
  `
});
