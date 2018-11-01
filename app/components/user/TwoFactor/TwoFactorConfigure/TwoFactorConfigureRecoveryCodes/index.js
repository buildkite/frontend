// @flow

import * as React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type {
  TwoFactorConfigureRecoveryCodes_recoveryCodes as recoveryCodes
} from './__generated__/TwoFactorConfigureRecoveryCodes_recoveryCodes.graphql';

type Props = {
  onCreateNewTotp: (callback?: () => void) => void,
  onNextStep: () => void,
  recoveryCodes: recoveryCodes,
  hasActivatedTotp: boolean
};

type State = {
  isLoading: boolean,
  didCopyRecoveryCodes: boolean
};

class TwoFactorConfigureRecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    didCopyRecoveryCodes: false,
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
        <p>
          Recovery codes are the only way to get access to your account if you lose access 
          to your authenticator application.
        </p>
        <Panel className="mb3 orange border-orange">
          <Panel.Section>
            <div>
              {this.props.hasActivatedTotp ? this.renderReconfigure() : this.renderConfigure()}
            </div>
          </Panel.Section>
        </Panel>
        <Panel className="mb3">
          <Panel.Section>
            <div className="flex justify-between">
              <CopyToClipboard text={this.recoveryCodeText()} onCopy={this.handleRecoveryCodeCopy}>
                <Button
                  theme="success"
                  disabled={this.state.isLoading}
                >
                  {this.state.didCopyRecoveryCodes ? 'Copied!' : 'Copy'}
                </Button>
              </CopyToClipboard>
            </div>
            <RecoveryCodeList
              recoveryCodes={this.props.recoveryCodes}
              isLoading={this.state.isLoading}
            />
          </Panel.Section>
        </Panel>
        <Button
          className="col-12"
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

  handleRecoveryCodeCopy = (_text: string, result: boolean) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
      return;
    }
    this.setState({ didCopyRecoveryCodes: true });
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
