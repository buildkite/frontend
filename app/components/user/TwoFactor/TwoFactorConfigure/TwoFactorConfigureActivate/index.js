// @flow

import * as React from "react";
import { graphql, commitMutation } from 'react-relay/compat';
import QRCode from 'qrcode.react';
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
      <div className="flex input">
        {fieldChars.map(([key, char]) => (
          <div className="p2 monospace h2" key={key}>
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
  hasExistingTotp: boolean,
  onNextStep: () => void,
  onActivateOtp: (token: string, callback?: () => void) => void,
  provisioningUri: string,
  totpId: ?string
};

type State = {
  errors: ?Array<ValidationError>,
  isActivating: boolean,
  totpCodeValue: string
};

export default class TwoFactorConfigureActivate extends React.PureComponent<Props, State> {
  state = {
    errors: [],
    isActivating: false,
    totpCodeValue: ''
  };

  render() {
    const errors = new ValidationErrors(this.state.errors);

    return (
      <React.Fragment>
        <Panel className="mb3">
          <Panel.Header>
            Configure Authenticator Application
          </Panel.Header>
          <Panel.Section>
            <p>
              To {this.props.hasExistingTotp ? 'reconfigure' : 'activate'} two-factor authentication, scan this
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
          <Panel.Footer>
            <code>{this.props.provisioningUri}</code>
          </Panel.Footer>
          {/*
          <Panel.Footer>
            <Button
              className="col-12"
              theme="success"
              onClick={this.props.onNextStep}
            >
              Continue
            </Button>
          </Panel.Footer>
          */}
        </Panel>
        <Panel>
          <Panel.Header>
            Activate Authenticator Application
          </Panel.Header>
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
              Activate
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
      });
    });
  }
}