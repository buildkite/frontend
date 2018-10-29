// @flow

import * as React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import ValidationErrors from 'app/lib/ValidationErrors';
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import TokenCodeInput from 'app/components/shared/TokenCodeInput';
import buildkiteqr from './buildkite.svg';

type ValidationError = {
  field: string,
  message: string
};

type Props = {
  hasActivatedTotp: boolean,
  onNextStep: () => void,
  onActivateOtp: (token: string, callback?: () => void) => void,
  provisioningUri: string
};

type State = {
  errors: ?Array<ValidationError>,
  isActivating: boolean,
  totpCodeValue: string,
  copiedProvisioningUri: boolean
};

export default class TwoFactorConfigureActivate extends React.PureComponent<Props, State> {
  state = {
    errors: [],
    isActivating: false,
    totpCodeValue: '',
    copiedProvisioningUri: false
  };

  render() {
    const errors = new ValidationErrors(this.state.errors);

    return (
      <React.Fragment>
        <Panel className="mt4">
          <Panel.Header>
            {this.props.hasActivatedTotp ? 'Reconfigure' : 'Activate'} Authenticator Application
          </Panel.Header>
          <Panel.Section>
            <p>
              To {this.props.hasActivatedTotp ? 'reconfigure' : 'activate'} two-factor authentication, scan this
              QR Code with your Authenticator Application, and then confirm.
            </p>
          </Panel.Section>
          <Panel.Section>
            <div className="flex justify-center items-center" style={{ minHeight: "340px" }}>
              <figure style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img style={{ position: 'absolute' }} src={buildkiteqr} />
                <QRCode
                  renderAs="svg"
                  fgColor="currentColor"
                  bgColor="transparent"
                  width="260"
                  height="260"
                  className="block my4 mx-auto"
                  level="H" // approx 30% error correction
                  style={{ maxWidth: '100%' }}
                  value={this.props.provisioningUri}
                />
              </figure>
            </div>
          </Panel.Section>
          <Panel.Section>
            <p><strong>Provisioning URI</strong></p>
            <div className="flex">
              <div className="flex input mr2">
                {this.props.provisioningUri}
              </div>
              <CopyToClipboard
                text={this.props.provisioningUri}
                onCopy={this.handleProvisioningUriCopy}
              >
                <Button
                  theme="default"
                  outline={true}
                >
                  {this.state.copiedProvisioningUri
                    ? 'Copied'
                    : 'Copy'
                  }
                </Button>
              </CopyToClipboard>
            </div>
            <small className="dark-gray">You can use this OTP provisioning URI to manually configure your Authenticator</small>
          </Panel.Section>
          <Panel.Section>
            <TokenCodeInput
              errors={errors.findForField('token')}
              disabled={this.state.isActivating}
              value={this.state.totpCodeValue}
              onChange={this.handleTotpCodeChange}
              onCodeComplete={this.handleTotpActivate}
            />
          </Panel.Section>
          <Panel.Footer>
            <Button
              className="col-12"
              theme="success"
              loading={this.state.isActivating && 'Activating…'}
            >
              {this.props.hasActivatedTotp ? 'Reconfigure' : 'Activate'}
            </Button>
          </Panel.Footer>
        </Panel>
      </React.Fragment>
    );
  }

  handleTotpCodeChange = (totpCodeValue: string) => {
    this.setState({ totpCodeValue });
  }

  handleTotpActivate = (value: string) => {
    this.setState({ isActivating: true }, () => {
      this.props.onActivateOtp(value, (errors) => {
        this.setState({ errors, isActivating: false }, () => {
          if (!errors) {
            this.props.onNextStep();
          }
        });
      });
    });
  }

  handleProvisioningUriCopy = (_text: string, result: boolean) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
      return;
    }
    this.setState({ copiedProvisioningUri: true });
  };
}