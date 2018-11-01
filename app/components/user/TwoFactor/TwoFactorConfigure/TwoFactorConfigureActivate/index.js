// @flow

import * as React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import { parseUrl } from 'query-string';
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
  onActivateOtp: (token: string, callback?: () => void) => void,
  provisioningUri: string
};

type State = {
  errors: ?Array<ValidationError>,
  isActivating: boolean,
  totpCodeValue: string,
  copiedOTPSecretKey: boolean
};

export default class TwoFactorConfigureActivate extends React.PureComponent<Props, State> {
  tokenInputRef: React.Ref<typeof TokenCodeInput>;
  state = {
    errors: [],
    isActivating: false,
    totpCodeValue: '',
    copiedOTPSecretKey: false
  };

  constructor(props: Props) {
    super(props);
    this.tokenInputRef = React.createRef();
  }

  render() {
    const errors = new ValidationErrors(this.state.errors);
    const provisioningUriSecret = parseUrl(this.props.provisioningUri).query.secret;

    return (
      <React.Fragment>
        <p>
          To activate two-factor authentication, scan this
          QR Code with your Authenticator Application, and then confirm.
        </p>
        <Panel className="mb3">
          <Panel.Section>
            <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
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
            <div>
              <strong>Secret Key</strong>
            </div>
            <div className="dark-gray mb1">
              Can’t use the QR code? You can use this secret key instead.
            </div>
            <div className="flex">
              <div className="input mr2 monospace" style={{ lineHeight: 1.8 }}>
                {provisioningUriSecret}
              </div>
              <CopyToClipboard
                text={provisioningUriSecret}
                onCopy={this.handleOTPSecretCopy}
              >
                <Button
                  theme="default"
                  outline={true}
                  loading={this.state.copiedOTPSecretKey && "Copied!"}
                  disabled={this.state.copiedOTPSecretKey}
                >
                  Copy
                </Button>
              </CopyToClipboard>
            </div>
          </Panel.Section>
        </Panel>
        <div className="py3 mb3">
          <TokenCodeInput
            ref={this.tokenInputRef}
            errors={errors.findForField('token')}
            disabled={this.state.isActivating}
            value={this.state.totpCodeValue}
            onChange={this.handleTotpCodeChange}
          />
        </div>
        <Button
          className="col-12"
          disabled={this.state.isActivating}
          theme="success"
          onClick={this.handleTotpActivate}
        >
          Activate
        </Button>
      </React.Fragment>
    );
  }

  handleTotpCodeChange = (totpCodeValue: string) => {
    this.setState({ totpCodeValue });
  }

  handleTotpActivate = () => {
    this.setState({ isActivating: true }, () => {
      this.props.onActivateOtp(this.state.totpCodeValue, (errors) => {
        if (errors) {
          this.setState({ errors, isActivating: false }, () => {
            if (this.tokenInputRef.current) {
              // $FlowExpectError Typing createRefs seems broken at the moment, hopefully we can fis this at some point.
              this.tokenInputRef.current.focus();
            }
          });
        } else {
          this.setState({ errors: [], isActivating: false });
        }
      });
    });
  }

  handleOTPSecretCopy = (_text: string, result: boolean) => {
    if (!result) {
      alert('We couldnʼt copy this to your clipboard, please copy it manually!');
      return;
    }
    this.setState({ copiedOTPSecretKey: true });
  };
}
