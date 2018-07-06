// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from "react-document-title";
import QRCode from 'qrcode.react';

import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
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
  isOpen: boolean,
  generatingTOTP: boolean,
  activatingTOTP: boolean,
  totpId: ?string,
  provisioningUri: ?string
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

class TwoFactorIndex extends React.PureComponent<Props, State> {
  state = {
    isOpen: false,
    generatingTOTP: false,
    activatingTOTP: false,
    totpId: null,
    provisioningUri: null
  };

  render() {
    return (
      <DocumentTitle title={`Two-Factor Authentication`}>
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="placeholder"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Two-Factor Authentication {this.renderBadge()}
            </PageHeader.Title>
            <PageHeader.Description>
              Manage your Two-Factor Authentication settings.
            </PageHeader.Description>
            {this.renderHeaderAction()}
          </PageHeader>

          {this.renderCurrentStatus()}
          {this.renderRecoveryCodes()}

          <Dialog
            isOpen={this.state.isOpen}
            onRequestClose={this.handleRequestClose}
            closeable={!(this.state.generatingTOTP || this.state.activatingTOTP)}
          >
            <div className="p4">
              <h1 className="m0 h2 semi-bold mb3">Activate Two-Factor Authentication</h1>

              <QRCode
                renderAs="svg"
                fgColor="currentColor"
                bgColor="transparent"
                width="320"
                height="auto"
                className="block my4 mx-auto"
                style={{
                  maxWidth: '100%'
                }}
                value={this.state.provisioningUri}
              />

              <p>To activate two-factor authentication, scan this QR Code with your authenticator application.</p>
              
              <p>If you need an authenticator application, some good options include {AUTHENTICATOR_LIST}.</p>

              <FormTextField
                label="Two-factor authentication code"
                autofocus={true}
              />

              <Button
                className="col-12"
                theme="success"
                onClick={this.handleActivateClick}
                loading={this.state.activatingTOTP && 'Activating…'}
              >
                Activate
              </Button>
            </div>
          </Dialog>
        </div>
      </DocumentTitle>
    );
  }

  renderBadge() {
    if (!this.props.viewer.totp) {
      return;
    }

    return (
      <Badge className="bg-green">
        Active
      </Badge>
    );
  }

  renderHeaderAction() {
    if (this.props.viewer.totp) {
      return (
        <PageHeader.Menu>
          <Button
            theme="error"
            outline={true}
          >
            Deactivate
          </Button>
        </PageHeader.Menu>
      );
    }

    return (
      <PageHeader.Menu>
        <Button
          theme="success"
          onClick={this.handleCreateClick}
          loading={this.state.generatingTOTP && 'Getting Started…'}
        >
          Get Started
        </Button>
      </PageHeader.Menu>
    );
  }

  renderCurrentStatus() {
    return (
      <Panel>
        <Panel.Section>
          Two-factor authentication is currently {this.props.viewer.totp ? 'active' : 'inactive'}.
        </Panel.Section>
      </Panel>
    );
  }

  renderRecoveryCodes() {
    if (!this.props.viewer.totp) {
      return;
    }

    return (
      <Panel>
        <Panel.Header>
          Recovery Codes
        </Panel.Header>
        <Panel.Section>
          <p>Recovery codes will give access to your account if you lose access to your device and cannot retrieve two-factor authentication codes.</p>
          <p>
            Buildkite support cannot restore access to accounts with two-factor authentication enabled for security reasons.
            {' '}
            <strong>Keep your recovery codes in a safe place to ensure you are not locked out of your account.</strong>
          </p>
        </Panel.Section>
        <Panel.Footer>
          <Button>
            View recovery codes
          </Button>
        </Panel.Footer>
      </Panel>
    );
  }

  handleCreateClick = () => {
    // If we've still got a TOTP ID and a Provisioning URI on hand,
    // re-use it, and avoid running the mutation again
    if (this.state.totpId && this.state.provisioningUri) {
      this.setState({ isOpen: true });
      return;
    }

    this.setState({ generatingTOTP: true }, () => {
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
    });
  };

  handleCreateMutationComplete = ({ totpCreate: { provisioningUri, totp: { id: totpId } } }: TOTPCreateType) => {
    this.setState({
      isOpen: true,
      generatingTOTP: false,
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
    this.setState({ generatingTOTP: true }, () => {
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
        variables: { input: { id: this.state.totpId, token: 999999 } },
        onCompleted: this.handleActivateMutationComplete,
        onError: this.handleActivateMutationError
      });
    });
  };

  handleActivateMutationComplete = ({ totpCreate: { provisioningUri, totp: { id: totpId } } }: TOTPCreateType) => {
    this.setState({
      generatingTOTP: false,
      totpId,
      provisioningUri
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
      isOpen: false,
      generatingTOTP: false
    });
  }
}

export default createFragmentContainer(TwoFactorIndex, {
  viewer: graphql`
    fragment TwoFactor_viewer on Viewer {
      totp {
        id
      }
    }
  `
});
