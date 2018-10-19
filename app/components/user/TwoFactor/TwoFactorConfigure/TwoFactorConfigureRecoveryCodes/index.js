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
  onRegenerateRecoveryCodes: (callback?: () => void) => void,
  onNextStep: () => void,
  relay: Object,
  recoveryCodes: recoveryCodes
};

type State = {
  isRegeneratingCodes: boolean,
  didCopyRecoveryCodes: boolean
};

class TwoFactorConfigureRecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    didCopyRecoveryCodes: false,
    isRegeneratingCodes: false
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
              <p>
                <strong>These codes should be treated just like your password!</strong>
                <br />
                We’d suggest saving them into a secure password manager, or printing them off and storing them
                somewhere safe.
              </p>
            </Panel.Section>
          </Panel>
          <Panel>
            <Panel.Section>
              <div className="flex justify-between">
                <Button
                  theme="success"
                  outline={true}
                  disabled={this.state.isRegeneratingCodes}
                  onClick={this.handleRegenerateRecoveryCode}
                >
                  Regenerate
                </Button>

                <CopyToClipboard text={this.recoveryCodeText()} onCopy={this.handleRecoveryCodeCopy}>
                  <Button
                    theme={this.state.didCopyRecoveryCodes ? 'default' : 'success'}
                    disabled={this.state.isRegeneratingCodes}
                  >
                    {this.state.didCopyRecoveryCodes ? 'Copied!' : 'Copy'}
                  </Button>
                </CopyToClipboard>
              </div>
              <RecoveryCodeList
                recoveryCodes={this.props.recoveryCodes}
                isRegeneratingCodes={this.state.isRegeneratingCodes}
              />
            </Panel.Section>
          </Panel>
        </Panel.Section>
        <Panel.Footer>
          <Button
            className="col-12"
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
    this.setState({ isRegeneratingCodes: true }, () => {
      this.props.onRegenerateRecoveryCodes(() => {
        this.setState({ isRegeneratingCodes: false });
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
