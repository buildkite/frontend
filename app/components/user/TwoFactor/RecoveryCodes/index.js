// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Button from 'app/components/shared/Button';
import Panel from 'app/components/shared/Panel';
import RecoveryCodeDialog from './RecoveryCodeDialog';
import type { RecoveryCodes_totp } from './__generated__/RecoveryCodes_totp.graphql';

type Props = {
  totp: RecoveryCodes_totp
};

type State = {
  dialogOpen: boolean
};

class RecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    dialogOpen: false
  };

  render() {
    return (
      <Panel className="mb4">
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          {this.props.totp.id ? (
            <React.Fragment>
              <p>Recovery codes will give access to your account if you lose access to your device and cannot retrieve two-factor authentication codes.</p>
              <p>
                Buildkite support cannot restore access to accounts with two-factor authentication enabled for security reasons.
                {' '}
                <strong>Keep your recovery codes in a safe place to ensure you are not locked out of your account.</strong>
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>You donʼt currently have any recovery codes; this probably means you activated two-factor authentication during the earliest beta, nice work!</p>
            </React.Fragment>
          )}
        </Panel.Section>
        <Panel.Footer>
          <Button onClick={this.handleOpenDialogClick}>
            {this.props.totp.id ? 'View' : 'Generate'} recovery codes
          </Button>
          {this.state.dialogOpen ? (
            <RecoveryCodeDialog
              onRequestClose={this.handleDialogClose}
              totp={this.props.totp}
            />
          ) : null}
        </Panel.Footer>
      </Panel>
    );
  }

  handleOpenDialogClick = () => {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }
}

export default createFragmentContainer(RecoveryCodes, {
  totp: graphql`
    fragment RecoveryCodes_totp on TOTP {
      id
      ...RecoveryCodeDialog_totp
    }
  `
});
