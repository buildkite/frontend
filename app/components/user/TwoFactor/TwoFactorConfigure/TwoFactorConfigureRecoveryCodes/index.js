// @flow

import * as React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Button from 'app/components/shared/Button';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type {
  TwoFactorConfigureRecoveryCodes_recoveryCodes as recoveryCodes
} from './__generated__/TwoFactorConfigureRecoveryCodes_recoveryCodes.graphql';

type Props = {
  onCreateNewTotp: (callback?: () => void) => void,
  onNextStep: () => void,
  recoveryCodes: recoveryCodes
};

type State = {
  isLoading: boolean
};

class TwoFactorConfigureRecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    isLoading: true
  }

  componentDidMount() {
    this.props.onCreateNewTotp(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <React.Fragment>
        <p>Recovery codes are the only way to login to your account if you lose access to your authenticator application.</p>
        <p>They should be treated like your password, so we suggest saving them in a secure password manager, or printing them and storing them somewhere safe.</p>
        <RecoveryCodeList
          recoveryCodes={this.props.recoveryCodes}
          isLoading={this.state.isLoading}
        />
        <Button
          className="col-12 mt3"
          disabled={this.state.isLoading}
          theme="success"
          onClick={this.props.onNextStep}
        >
          Next
        </Button>
      </React.Fragment>
    );
  }

  recoveryCodeText = () => {
    if (!this.props.recoveryCodes) {
      return '';
    }
    return this.props.recoveryCodes.codes.map(({ code }) => code).join('\n');
  }

  renderReconfigure = () => {
    return "Youʼre about to reconfigure two-factor authentication.\
      This will invalidate your existing two-factor authentication configuration and recovery codes.\
      We suggest saving your new recovery codes in a secure password manager, or printing them and storing them somewhere safe.";
  }

  renderConfigure = () => {
    return "Recovery codes should be treated like your password.\
    We suggest saving them in a secure password manager, or printing them and storing them somewhere safe.";
  }
}

export default createFragmentContainer(TwoFactorConfigureRecoveryCodes, {
  recoveryCodes: graphql`
    fragment TwoFactorConfigureRecoveryCodes_recoveryCodes on RecoveryCodeBatch {
      ...RecoveryCodeList_recoveryCodes
      codes {
        code
        consumed
      }
    }
  `
});
