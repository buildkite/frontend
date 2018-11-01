// @flow

import * as React from "react";
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
          To activate two-factor authentication, scan this barcode with your authenticator application, then enter the generated One Time Password below.
        </p>
        <Panel className="mb3">
          <div className="flex justify-center items-center">
            <div className="mt1 mb3">
              <figure style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img style={{ position: 'absolute' }} src={buildkiteqr} />
                <QRCode
                  renderAs="svg"
                  fgColor="currentColor"
                  bgColor="transparent"
                  width="260"
                  height="260"
                  className="block mx-auto"
                  level="H" // approx 30% error correction
                  style={{ maxWidth: '100%' }}
                  value={this.props.provisioningUri}
                />
              </figure>
              <div className="dark-gray center mt2">
                Can’t use the barcode?<br />Type in this secret key instead: <span className="monospace rounded" style={{ fontSize: 13 }}>{provisioningUriSecret}</span>
              </div>
            </div>
          </div>
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
}
