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
  onRegenerateRecoveryCodes: (callback?: () => void) => void,
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
      <Panel className="mt4">
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          <p>
            Recovery codes are used if you lose access to your OTP generator application. They’re the only way to get
            back into your account if you lose access to your Authenticator Application once it’s configured.
          </p>
          <Panel className="mb3 orange border-orange">
            <Panel.Section>
              <div>
                {this.props.hasActivatedTotp ? this.renderReconfigure() : this.renderConfigure()}
              </div>
            </Panel.Section>
          </Panel>
          <Panel>
            <Panel.Section>
              <div className="flex justify-between">
                <Button
                  theme="success"
                  outline={true}
                  disabled={this.state.isLoading}
                  onClick={this.handleRegenerateRecoveryCode}
                >
                  Regenerate
                </Button>

                <CopyToClipboard text={this.recoveryCodeText()} onCopy={this.handleRecoveryCodeCopy}>
                  <Button
                    theme={this.state.didCopyRecoveryCodes ? 'default' : 'success'}
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
        </Panel.Section>
        <Panel.Footer>
          <Button
            className="col-12"
            disabled={this.state.isLoading}
            theme={this.state.didCopyRecoveryCodes ? 'success' : 'default'}
            onClick={this.props.onNextStep}
          >
            Next
          </Button>
        </Panel.Footer>
      </Panel>
    );
  }

  handleRegenerateRecoveryCode = () => {
    this.setState({ isLoading: true }, () => {
      this.props.onRegenerateRecoveryCodes(() => {
        this.setState({ isLoading: false });
      });
    });
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
      We’d suggest saving your recovery codes into a secure password manager, or printing them off and storing them\
      somewhere safe.\
      They should be treated just like your password!"
  }

  renderConfigure  = () => {
    return "Recovery codes should be treated just like your password!\
    We’d suggest saving them into a secure password manager, or printing them off and storing them somewhere safe."
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
