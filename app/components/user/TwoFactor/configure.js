// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import QRCode from 'qrcode.react';

import Button from '../../shared/Button';
import FormTextField from '../../shared/FormTextField';
import PageHeader from "../../shared/PageHeader";
import Panel from '../../shared/Panel';
import Icon from "../../shared/Icon";

type Props = {
  viewer: {
    totp: ?{
      id: string
    }
  },
  relay: Object
};

type State = {
  generatingTOTP: boolean,
  generatedTOTP: boolean,
  activatingTOTP: boolean,
  activatedTOTP: boolean,
  totpId: ?string,
  provisioningUri: ?string,
  totpToken: string
};

type TOTPCreateType = {
  totpCreate: {
    provisioningUri: string,
    totp: {
      id: string
    }
  }
};

const AUTHENTICATORS = {
  '1Password': 'https://1password.com',
  'OTP Auth': 'https://cooperrs.de/otpauth.html',
  'Duo Mobile': 'https://duo.com/product/trusted-users/two-factor-authentication/duo-mobile',
  'Authy': 'https://authy.com',
  'Google Authenticator': 'https://support.google.com/accounts/answer/1066447'
};

const AUTHENTICATOR_LIST = (
  Object.keys(AUTHENTICATORS).map((authenticator_name) => (
    <a
      className="blue hover-navy text-decoration-none hover-underline"
      key={authenticator_name}
      href={AUTHENTICATORS[authenticator_name]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {authenticator_name}
    </a>
  )).reduce((acc, link, index, items) => {
    if (index > 0) {
      if (index < items.length - 1) {
        acc.push(', ');
      }

      if (index === items.length - 1) {
        acc.push(' and ');
      }
    }

    acc.push(link);

    return acc;
  }, [])
);

class TwoFactorConfigure extends React.PureComponent<Props, State> {
  state = {
    generatingTOTP: true,
    generatedTOTP: false,
    activatingTOTP: false,
    activatedTOTP: false,
    totpId: null,
    provisioningUri: null,
    totpToken: ''
  };

  render() {
    return (
      <DocumentTitle title={`Configure Two-Factor Authentication`}>
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="placeholder"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Configure Two-Factor Authentication
            </PageHeader.Title>
            <PageHeader.Description>
              Manage your Two-Factor Authentication settings.
            </PageHeader.Description>
            <PageHeader.Menu>
              <Button
                theme="default"
                outline={true}
                link="/user/two-factor"
              >
                Cancel
              </Button>
            </PageHeader.Menu>
          </PageHeader>

          {this.renderCurrentStatus()}
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStatus() {
    if (this.state.generatingTOTP) {
      return (
        <Panel>
          <Panel.Section>
            Be very, very quiet - weʼre generating secrets…
          </Panel.Section>
        </Panel>
      );
    } else if (this.state.generatedTOTP && !this.state.activatedTOTP) {
      return (
        <Panel>
          <Panel.Section>
            {/* TODO: Add wording for re-activating when TOTP is already active */}
            <p>To activate two-factor authentication, scan this QR Code with your authenticator application.</p>

            <QRCode
              renderAs="svg"
              fgColor="currentColor"
              bgColor="transparent"
              width="300"
              height="auto"
              className="block my4 mx-auto"
              style={{
                maxWidth: '100%'
              }}
              value={this.state.provisioningUri}
            />

            <p>If you need an authenticator application, some good options include {AUTHENTICATOR_LIST}.</p>
          </Panel.Section>

          <Panel.Section>
            <FormTextField
              label="Two-factor authentication code"
              autoFocus={true}
              placeholder="123456"
              onChange={this.handleCodeChange}
            />

            <Button
              className="col-12"
              theme="success"
              onClick={this.handleActivateClick}
              loading={this.state.activatingTOTP && 'Activating…'}
            >
              Activate
            </Button>
          </Panel.Section>
        </Panel>
      );
    } else if (this.state.activatedTOTP) {
      return (
        <Panel>
          <Panel.Section>
            <p>Congratulations! Two-factor authentication is now configured for your account.</p>
          </Panel.Section>
        </Panel>
      );
    }
  }

  componentDidMount() {
    // Immediately go generate a token
    commitMutation(this.props.relay.environment, {
      mutation: graphql`
        mutation TwoFactorCreateMutation($input: TOTPCreateInput!) {
          totpCreate(input: $input) {
            clientMutationId
            provisioningUri
            totp {
              id
            }
          }
        }
      `,
      variables: { input: {} },
      onCompleted: this.handleCreateMutationComplete,
      onError: this.handleCreateMutationError
    });
  }

  componentWillUnmount() {
    // When unmounting, if we haven't finished activating, try to delete the TOTP record
    if (this.state.totpId && this.state.generatedTOTP && !this.state.activatedTOTP) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorDeleteMutation($input: TOTPDeleteInput!) {
            totpDelete(input: $input) {
              clientMutationId
            }
          }
        `,
        variables: { input: { id: this.state.totpId } }
      });
    }
  }

  handleCodeChange = (event) => {
    this.setState({ totpToken: event.target.value });
  };

  handleCreateMutationComplete = ({ totpCreate: { provisioningUri, totp: { id: totpId } } }: TOTPCreateType) => {
    this.setState({
      generatingTOTP: false,
      generatedTOTP: true,
      totpId,
      provisioningUri
    });
  };

  handleCreateMutationError = (error) => {
    if (error) {
      // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
      //   this.setState({ errors: error.source.errors });
      // } else {
      alert(error);
      // }
    }
  };

  handleActivateClick = () => {
    this.setState({ activatingTOTP: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorActivateMutation($input: TOTPActivateInput!) {
            totpActivate(input: $input) {
              clientMutationId
              totp {
                id
              }
            }
          }
        `,
        variables: { input: { id: this.state.totpId, token: this.state.totpToken } },
        onCompleted: this.handleActivateMutationComplete,
        onError: this.handleActivateMutationError
      });
    });
  };

  handleActivateMutationComplete = () => {
    this.setState({
      activatingTOTP: false,
      activatedTOTP: true,
      totpId: null,
      provisioningUri: null
    });
  };

  handleActivateMutationError = (error) => {
    if (error) {
      // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
      //   this.setState({ errors: error.source.errors });
      // } else {
      alert(error);
      // }
    }
  };

  handleRequestClose = () => {
    this.setState({
      generatingTOTP: false
    });
  }
}

export default createFragmentContainer(TwoFactorConfigure, {
  viewer: graphql`
    fragment TwoFactorConfigure_viewer on Viewer {
      totp {
        id
      }
    }
  `
});
