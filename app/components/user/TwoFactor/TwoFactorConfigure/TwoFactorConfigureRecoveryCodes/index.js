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
        <Panel.Section>
          <p>Recovery codes are used if you lose access to your OTP generator application.</p>
          <p>Copy or print these recovery codes before you continue to configure two-factor authentication.</p>

          <RecoveryCodeList recoveryCodes={this.props.recoveryCodes} />

          <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>

          <CopyToClipboard text={text} onCopy={this.handleRecoveryCodeCopy}>
            <Button className="col-12" theme="success">Copy Recovery Codes</Button>
          </CopyToClipboard>
        </Panel.Section>

        <Button
          className="col-12"
          theme="success"
          onClick={this.props.handleRegenerateRecoveryCode}
        >
            Regenerate Recovery Codes
        </Button>

        <Panel.Section>
          <Button
            className="col-12"
            theme={this.state.copiedRecoveryCodes ? 'success' : 'default'}
            onClick={this.props.handleNextStep}
          >
            Continue
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  handleRecoveryCodeCopy = () => {
    debugger
  }
}