// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from "react-document-title";
import QRCode from 'qrcode.react';

import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
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

type TOTPType = {
  id: string,
  provisioningUri: ?string
};

type State = {
  isOpen: boolean,
  generatingTOTP: boolean,
  totp: ?TOTPType
};

type TOTPCreateType = {
  totpCreate: {
    totp: TOTPType
  }
};

class TwoFactorIndex extends React.PureComponent<Props, State> {
  state = {
    isOpen: false,
    generatingTOTP: false,
    totp: null
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
          >
            <div className="p4">
              <h1 className="m0 h2 semi-bold mb3">Activate Two-Factor Authentication</h1>

              <QRCode
                renderAs="svg"
                fgColor="currentColor"
                bgColor="transparent"
                width="100%"
                height="100%"
                style={{
                  maxWidth: '50vw',
                  maxHeight: '50vh'
                }}
                value={
                  this.state.generatingTOTP || !this.state.totp || !this.state.totp.provisioningUri
                    ? 'Loading…'
                    : this.state.totp.provisioningUri
                }
              />
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
          onClick={this.handleActivateClick}
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

  handleActivateClick = () => {
    this.setState({
      isOpen: true,
      generatingTOTP: true
    }, () => {
      const mutation = graphql`
        mutation TwoFactorCreateMutation($input: TOTPCreateInput!) {
          totpCreate(input: $input) {
            clientMutationId
            totp {
              id
              provisioningUri
            }
          }
        }
      `;

      commitMutation(
        this.props.relay.environment,
        {
          mutation: mutation,
          variables: { input: {} },
          onCompleted: this.handleMutationComplete,
          onError: this.handleMutationError
        }
      );
    });
  };

  handleMutationError = (error) => {
    if (error) {
      // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
      //   this.setState({ errors: error.source.errors });
      // } else {
      alert(error);
      // }
    }
  };

  handleMutationComplete = (response: TOTPCreateType) => {
    this.setState({
      generatingTOTP: false,
      totp: response.totpCreate.totp
    });
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
