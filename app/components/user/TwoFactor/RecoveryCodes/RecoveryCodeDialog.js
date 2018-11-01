// @flow

import * as React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from 'app/components/shared/Button';
import Dialog from 'app/components/shared/Dialog';
import Panel from 'app/components/shared/Panel';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type { RecoveryCodeDialog_totp } from './__generated__/RecoveryCodeDialog_totp.graphql';
import type { RelayProp } from 'react-relay';

type Props = {
  relay: RelayProp,
  onRequestClose: Function,
  totp: RecoveryCodeDialog_totp
};

type State = {
  copiedRecoveryCodes: boolean,
  generatingNewCodes: boolean
};

type RecoveryCodes = $PropertyType<RecoveryCodeDialog_totp, 'recoveryCodes'>;

function recoveryCodeText(recoveryCodes: RecoveryCodes): ?string {
  if (recoveryCodes && recoveryCodes.codes) {
    return recoveryCodes.codes.reduce((memo, { code }) => memo.concat(code), []).join('\n');
  }
  return '';
}

class RecoveryCodesDialog extends React.PureComponent<Props, State> {
  state = {
    copiedRecoveryCodes: false,
    generatingNewCodes: false
  }

  render() {
    return (
      <Dialog isOpen={true} onRequestClose={this.props.onRequestClose} width={540}>
        <div className="p4">
          <h2 className="m0 h2 semi-bold mb5">Current Recovery Codes</h2>
          <p>Recovery codes are used if you lose access to your code generator.</p>
          <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>
          <Panel className="mb3">
            <Panel.Section>
              <CopyToClipboard
                text={recoveryCodeText(this.props.totp.recoveryCodes)}
                onCopy={this.handleRecoveryCodeCopy}
              >
                <Button theme="default" outline={true}>
                  {this.state.copiedRecoveryCodes
                    ? 'Copied!'
                    : 'Copy'}
                </Button>
              </CopyToClipboard>
              <RecoveryCodeList
                recoveryCodes={this.props.totp.recoveryCodes}
                isLoading={this.state.generatingNewCodes}
              />
            </Panel.Section>
          </Panel>
          <h2 className="m0 h4 semi-bold mb5">Generate New Recovery Codes</h2>
          <p>When you generate new recovery codes, your current codes will be removed. Please ensure you copy your new recovery codes after they’ve been generated.</p>
          <Button
            className="col-12"
            theme="warning"
            outline={true}
            onClick={this.handleRegenerateRecoveryCodes}
            loading={this.state.generatingNewCodes && "Generating New Recovery Codes…"}
            disabled={this.state.generatingNewCodes}
          >
            Generate New Recovery Codes
          </Button>
        </div>
      </Dialog>
    );
  }

  handleRecoveryCodeCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
    }
    this.setState({ copiedRecoveryCodes: true });
  };

  handleRegenerateRecoveryCodes = () => {
    this.setState({ generatingNewCodes: true });

    commitMutation(this.props.relay.environment, {
      mutation: graphql`
          mutation RecoveryCodeDialogRegenerateMutation($input: TOTPRecoveryCodesRegenerateInput!) {
            totpRecoveryCodesRegenerate(input: $input) {
              totp {
                id
                recoveryCodes {
                  id
                  codes {
                    code
                    consumed
                  }
                }
              }
            }
          }
        `,
      variables: { input: { totpId: this.props.totp.id } },
      onCompleted: () => {
        this.setState({ generatingNewCodes: false });
      },
      onError: (error) => {
        alert(error);
      }
    });
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
