// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';

import Button from '../../../shared/Button';
import Panel from '../../../shared/Panel';

import Dialog from './dialog';

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

    return (
      <Panel className="mb4">
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          {this.props.totp.recoveryCodes
            ? (
              <React.Fragment>
                <p>Recovery codes will give access to your account if you lose access to your device and cannot retrieve two-factor authentication codes.</p>
                <p>
                  Buildkite support cannot restore access to accounts with two-factor authentication enabled for security reasons.
                  {' '}
                  <strong>Keep your recovery codes in a safe place to ensure you are not locked out of your account.</strong>
                </p>
              </React.Fragment>
            )
            : (
              <React.Fragment>
                <p>You donʼt currently have any recovery codes; this probably means you activated two-factor authentication during the earliest beta, nice work!</p>
                <p>Someday soon thereʼll be a “generate recovery codes” button here. For now, you can use the “reconfigure two-factor authentication” option above.</p>
              </React.Fragment>
            )}
        </Panel.Section>
        <Panel.Footer>
          <Button onClick={this.handleOpenDialogClick}>
            {this.props.totp.recoveryCodes ? 'View' : 'Generate'} recovery codes
          </Button>
          <Dialog
            isOpen={this.state.isDialogOpen}
            onRequestClose={this.handleDialogClose}
            totp={this.props.totp}
          />
        </Panel.Footer>
      </Panel>
    );
  }

  handleOpenDialogClick = () => {
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
      ...Dialog_totp
      recoveryCodes {
        codes
      }
    }
  `
});
