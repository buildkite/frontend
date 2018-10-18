// @flow

import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Button from 'app/components/shared/Button';
import Dialog from 'app/components/shared/Dialog';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type { RecoveryCodeDialog_totp } from './__generated__/RecoveryCodeDialog_totp.graphql';

type RecoveryCodes = $PropertyType<RecoveryCodeDialog_totp, 'recoveryCodes'>;

type Props = {
  onRequestClose: Function,
  totp: RecoveryCodeDialog_totp,
  relay: Object,
  recoveryCodes: RecoveryCodes,
};

function recoveryCodeText(recoveryCodes: RecoveryCodes): ?string {
  if (recoveryCodes && recoveryCodes.codes) {
    return recoveryCodes.codes.reduce((memo, { code }) => memo.concat(code), []).join('\n');
  }
  return '';
}

class RecoveryCodesDialog extends React.PureComponent<Props> {

  render() {
    return (
      <Dialog isOpen={true} onRequestClose={this.props.onRequestClose} width={540}>
        <div className="p4">
          {(this.props.totp.recoveryCodes)}
        </div>
      </Dialog>
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
