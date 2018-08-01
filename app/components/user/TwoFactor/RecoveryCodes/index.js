// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Button from '../../../shared/Button';
import Dialog from '../../../shared/Dialog';
import Panel from '../../../shared/Panel';
import RecoveryCodeList from '../../../recovery_code_list';

type Props = {
  totp: ?{
    recoveryCodes: ?{
      codes: Array<string>
    }
  }
};

type State = {
  isDialogOpen: boolean
};

class RecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    isDialogOpen: false
  };

  render() {
    if (!this.props.totp) {
      return;
    }

    if (!this.props.totp.recoveryCodes) {
      return (
        <Panel className="mb4">
          <Panel.Header>
            Recovery Codes
          </Panel.Header>
          <Panel.Section>
            <p>You donʼt currently have any recovery codes; this probably means you activated two-factor authentication during the earliest beta, nice work!</p>
            <p>Someday soon thereʼll be a “generate recovery codes” button here. For now, you can use the “reconfigure two-factor authentication” option above.</p>
          </Panel.Section>
        </Panel>
      );
    }

    return (
      <Panel className="mb4">
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          <p>Recovery codes will give access to your account if you lose access to your device and cannot retrieve two-factor authentication codes.</p>
          <p>
            Buildkite support cannot restore access to accounts with two-factor authentication enabled for security reasons.
            {' '}
            <strong>Keep your recovery codes in a safe place to ensure you are not locked out of your account.</strong>
          </p>
        </Panel.Section>
        <Panel.Footer>
          <Button onClick={this.handleViewCodesClick}>
            View recovery codes
          </Button>
          <Dialog
            isOpen={this.state.isDialogOpen}
            onRequestClose={this.handleDialogClose}
            width={420}
          >
            <div className="p4">
              <h2 className="m0 h2 semi-bold mb3">Current Recovery Codes</h2>

              <p>Recovery codes are used if you lose access to your code generator.</p>

              <RecoveryCodeList
                recoveryCodes={this.props.totp.recoveryCodes}
              />

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
            </div>
          </Dialog>
        </Panel.Footer>
      </Panel>
    );
  }

  handleViewCodesClick = () => {
    this.setState({ isDialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ isDialogOpen: false });
  }

  handleRecoveryCodeCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
    }
  }
}

export default createFragmentContainer(RecoveryCodes, {
  totp: graphql`
    fragment RecoveryCodes_totp on TOTP {
      recoveryCodes {
        ...RecoveryCodeList_recoveryCodes
        codes
      }
    }
  `
});
