// @flow

import * as React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Spinner from 'app/components/shared/Spinner';
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import RecoveryCodeList from 'app/components/RecoveryCodeList';

type Props = {
  handleRegenerateRecoveryCode: () => void,
  handleNextStep: () => void,
  recoveryCodes: *
  // previousStep: () => void,
};

type State = {
  copiedRecoveryCodes: boolean
};

export default class TwoFactorConfigureRecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    copiedRecoveryCodes: false
  }

  render() {
    const text = ""; // this.state.recoveryCodes.codes.join('\n')

    return (
      <Panel>
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          <p>
            Recovery codes are used if you lose access to your OTP generator application. They’re the only way to get back into
            your account if you lose access to your Authenticator Application once it’s configured.
          </p>
        </Panel.Section>
        <Panel.Section>
          <Panel className="mb3 orange border-orange">
            <Panel.Section>
              <p>
                <strong>These codes should be treated just like your password!</strong>
                <br />
                Weʼd suggest saving them into a secure password manager, or printing them off and storing them somewhere safe.
              </p>
            </Panel.Section>
          </Panel>
          <Panel>
            <Panel.Section>
              <CopyToClipboard text={text} onCopy={this.handleRecoveryCodeCopy}>
                <Button theme="success">Copy</Button>
              </CopyToClipboard>
              <RecoveryCodeList recoveryCodes={this.props.recoveryCodes} />
            </Panel.Section>
          </Panel>
        </Panel.Section>
        <Panel.Footer>
          <Button
            className="col-12"
            theme={this.state.copiedRecoveryCodes ? 'success' : 'default'}
            onClick={this.props.handleNextStep}
          >
            Continue
          </Button>
        </Panel.Footer>
      </Panel>
    );
  }

  handleRecoveryCodeCopy = () => {
    debugger
  }
}