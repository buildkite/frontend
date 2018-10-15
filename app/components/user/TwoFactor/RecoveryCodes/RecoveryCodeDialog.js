// @flow

import * as React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import Dialog from 'app/components/shared/Dialog';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type { RecoveryCodeDialog_totp } from './__generated__/RecoveryCodeDialog_totp.graphql';
import type { _RecoveryCodeDialogCreateMutationVariables, RecoveryCodeDialogCreateMutationResponse } from './__generated__/RecoveryCodeDialogCreateMutation.graphql';

type RecoveryCodes = $PropertyType<RecoveryCodeDialog_totp, 'recoveryCodes'>;

type Props = {
  onRequestClose: Function,
  totp: RecoveryCodeDialog_totp,
  relay: Object
};

type State = {
  generatingRecoveryCodes: boolean,
  generatedRecoveryCodes: boolean,
  recoveryCodes: RecoveryCodes
};

function recoveryCodeText(recoveryCodes: RecoveryCodes): ?string {
  if (recoveryCodes && recoveryCodes.codes) {
    return recoveryCodes.codes.reduce((memo, { code }) => memo.concat(code), []).join('\n');
  }
  return '';
}

class RecoveryCodesDialog extends React.PureComponent<Props, State> {
  state = {
    generatingRecoveryCodes: false,
    generatedRecoveryCodes: false,
    recoveryCodes: null
  };

  componentDidMount() {
    // If we have a TOTP, but no recovery codes for it, immediately go generate some recovery codes.
    if (this.props.totp && !this.props.totp.recoveryCodes) {
      this.generateRecoveryCodes();
    }
  }

  render() {
    return (
      <Dialog isOpen={true} onRequestClose={this.props.onRequestClose} width={540}>
        <div className="p4">
          {(this.props.totp.recoveryCodes
            ? this.renderTotpRecoveryCodes()
            : this.renderGenerateTotpRecoveryCodes()
          )}
        </div>
      </Dialog>
    );
  }

  // TODO: Dry this up...
  renderGenerateTotpRecoveryCodes() {
    if (this.state.generatingRecoveryCodes) {
      return (
        <React.Fragment>
          <h2 className="m0 h2 semi-bold mb3">Generating Recovery Codes</h2>
          <p>Please wait, weʼre getting some recovery codes ready for you.</p>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h2 className="m0 h2 semi-bold mb3">Generated Recovery Codes</h2>
        <p>Recovery codes are used if you lose access to your code generator.</p>
        <RecoveryCodeList recoveryCodes={this.state.recoveryCodes} />
        <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>
        <CopyToClipboard
          text={recoveryCodeText(this.state.recoveryCodes)}
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

  // TODO: Dry this up...
  renderTotpRecoveryCodes() {
    return (
      <React.Fragment>
        <h2 className="m0 h2 semi-bold mb5">Current Recovery Codes</h2>
        <p>Recovery codes are used if you lose access to your code generator.</p>
        <RecoveryCodeList recoveryCodes={this.props.totp.recoveryCodes} />
        <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>
        <CopyToClipboard
          text={recoveryCodeText(this.props.totp.recoveryCodes)}
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

  generateRecoveryCodes() {
    this.setState({ generatingRecoveryCodes: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation RecoveryCodeDialogCreateMutation($input: TOTPRecoveryCodesRegenerateInput!) {
            totpRecoveryCodesRegenerate(input: $input) {
              clientMutationId
              totp {
                id
                recoveryCodes {
                  ...RecoveryCodeList_recoveryCodes
                }
              }
              recoveryCodes {
                ...RecoveryCodeList_recoveryCodes
              }
            }
          }
        `,
        variables: { input: { totpId: this.props.totp.id } },
        onCompleted: this.handleCreateMutationComplete,
        onError: this.handleCreateMutationError
      });
    });
  }

  handleCreateMutationComplete = ({ totpRecoveryCodesRegenerate }: RecoveryCodeDialogCreateMutationResponse) => {
    if (totpRecoveryCodesRegenerate) {
      this.setState({
        generatingRecoveryCodes: false,
        generatedRecoveryCodes: true,
        recoveryCodes: totpRecoveryCodesRegenerate.recoveryCodes
      });
    }
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
    fragment RecoveryCodeDialog_totp on TOTP {
      id
      recoveryCodes {
        id
        ...RecoveryCodeList_recoveryCodes
        codes {
          code
          consumed
        }
      }
    }
  `
});
