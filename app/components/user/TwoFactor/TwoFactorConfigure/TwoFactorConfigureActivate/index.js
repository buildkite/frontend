// @flow

import * as React from "react";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { graphql, commitMutation } from 'react-relay/compat';
import QRCode from 'qrcode.react';
import styled from 'styled-components';
import ValidationErrors from 'app/lib/ValidationErrors';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import FormTextField from 'app/components/shared/FormTextField';
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';
import buildkiteqr from './buildkite.svg';


function TotpCodeInput({ value, onChange, onCodeComplete, errors }) {
  const valueChars = value.split('');
  const fieldChars = [...Array(6).keys()].map((index: number) => [`char-${index}`, valueChars[index]]);
  const valueFilter = new RegExp(/^\d+$/);

  function validCodeValue(value: string) {
    if (value === "") {
      return true;
    }
    return valueFilter.test(value);
  }

  function handleChange(event: SyntheticEvent<HTMLInputElement>) {
    event.preventDefault();
    const { value: nextValue } = event.currentTarget;
    if (nextValue.length <= fieldChars.length && validCodeValue(nextValue)) {
      onChange(event);
    }
    if (nextValue.length === fieldChars.length) {
      onCodeComplete(nextValue);
    }
  }

  return (
    <div>
      <div className="flex input p0">
        {fieldChars.map(([key, char]) => (
          <div className="p2 monospace h2" style={{ borderRight: "1px solid red" }} key={key}>
            {char}
          </div>
        ))}
      </div>
      <FormTextField
        label=""
        value={value}
        autoFocus={true}
        onChange={handleChange}
        errors={errors}
      />
    </div>
  );
}

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
        <Panel className="mb3">
          <Panel.Header>
            {this.props.hasActivatedTotp ? 'Reconfigure' : 'Activate'} Authenticator Application
          </Panel.Header>
          <Panel.Section>
            <p>
              To {this.props.hasActivatedTotp ? 'reconfigure' : 'activate'} two-factor authentication, scan this
              QR Code with your Authenticator Application, and then confirm
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
            <CopyToClipboard
              text={this.props.provisioningUri}
              onCopy={this.handleProvisioningUriCopy}
            >
              <Button
                theme="default"
                outline={true}
                outline={this.state.copiedProvisioningUri}
              >
                {this.state.copiedProvisioningUri
                  ? 'Copied'
                  : 'Copy'
                }
              </Button>
            </CopyToClipboard>
          </Panel.Section>
          <Panel.Section>
            <TotpCodeInput
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

  handleTotpCodeChange = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault();
    this.setState({ totpCodeValue: event.currentTarget.value });
  }

  handleTotpActivate = (value: string) => {
    this.setState({ isActivating: true }, () => {
      this.props.onActivateOtp(value, () => {
        this.setState({ isActivating: false });
        this.props.onNextStep();
      });
    });
  }

  handleProvisioningUriCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
      return;
    }
     this.setState({ copiedProvisioningUri: true });
  };
}