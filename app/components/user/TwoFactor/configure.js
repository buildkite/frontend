// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import QRCode from 'qrcode.react';

import GraphQLErrors from '../../../constants/GraphQLErrors';
import ValidationErrors from '../../../lib/ValidationErrors';

import Button from '../../shared/Button';
import FormTextField from '../../shared/FormTextField';
import PageHeader from "../../shared/PageHeader";
import Panel from '../../shared/Panel';
import Icon from "../../shared/Icon";
import Spinner from '../../shared/Spinner';

type Props = {
  viewer: {
    totp: ?{
      id: string
    }
  },
  relay: Object
};

type State = {
  errors: ?[],
  generatingTOTP: boolean,
  generatedTOTP: boolean,
  activatingTOTP: boolean,
  activatedTOTP: boolean,
  totpId: ?string,
  provisioningUri: ?string,
  totpToken: string
};

type TOTPCreateReturnType = {
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
    errors: null,
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
              Manage your two-factor authentication settings.
            </PageHeader.Description>
            <PageHeader.Menu>
              <Button
                theme="default"
                outline={true}
                link="/user/two-factor"
              >
                {this.state.activatedTOTP ? 'Done' : 'Cancel'}
              </Button>
            </PageHeader.Menu>
          </PageHeader>

          {this.renderCurrentStatus()}
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStatus() {
    const errors = new ValidationErrors(this.state.errors);

    if (this.state.generatingTOTP) {
      return (
        <Panel>
          <Panel.Section>
            <Spinner /> Getting ready to {this.props.viewer.totp ? 'reconfigure' : 'configure'} two-factor authentication…
          </Panel.Section>
        </Panel>
      );
    } else if (this.state.generatedTOTP && !this.state.activatedTOTP) {
      return (
        <Panel>
          <Panel.Section>
            {this.props.viewer.totp && (
              <Panel className="orange border-orange">
                <Panel.Section>
                  <strong>Youʼre about to reconfigure two-factor authentication.</strong> This will replace your existing two-factor authentication applications and recovery codes.
                </Panel.Section>
              </Panel>
            )}

            <p>To {this.props.viewer.totp ? 'reconfigure' : 'activate'} two-factor authentication, scan this QR Code with your authenticator application.</p>

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
            <form onSubmit={this.handleActivateSubmit}>
              <FormTextField
                label="Two-factor authentication code"
                autoFocus={true}
                placeholder="123456"
                onChange={this.handleCodeChange}
                errors={errors.findForField('token')}
              />

              <Button
                className="col-12"
                theme="success"
                loading={this.state.activatingTOTP && 'Activating…'}
              >
                Activate
              </Button>
            </form>
          </Panel.Section>
        </Panel>
      );
    } else if (this.state.activatedTOTP) {
      return (
        <Panel>
          <Panel.Section>
            <p>Congratulations! Two-factor authentication is now configured for your account.</p>

            <Button
              theme="success"
              link="/user/two-factor"
            >
              Back to Two-Factor Authentication Settings
            </Button>
          </Panel.Section>
        </Panel>
      );
    }
  }

  componentDidMount() {
    // Immediately go generate a token
    commitMutation(this.props.relay.environment, {
      mutation: graphql`
        mutation configureCreateMutation($input: TOTPCreateInput!) {
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
          mutation configureDeleteMutation($input: TOTPDeleteInput!) {
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

  handleCreateMutationComplete = (mutationResult: TOTPCreateReturnType) => {
    this.setState({
      generatingTOTP: false,
      generatedTOTP: true,
      totpId: mutationResult.totpCreate.totp.id,
      provisioningUri: mutationResult.totpCreate.provisioningUri,
      errors: null
    });
  };

  handleCreateMutationError = (error) => {
    if (error && error.source) {
      switch (error.source.type) {
        case GraphQLErrors.ERROR:
          // TODO: Sorry, this check sucks, I know, but it's temporary until we don't have any users under classic SSO rules - Jessica, July '18
          // If we get an SSO-related error back, something's gone weird (a user shouldn't be able to get here under those circumstances) but I'm handling it just in case.
          if (error.source.errors && error.source.errors[0] && error.source.errors[0].message && error.source.errors[0].message === 'TOTP configuration is not available to SSO users') {
            // Show an alert (the backend handling would show a similar flash, but I decided this was better than allowing for a potential infinite loop)
            alert([
              'You currently use Buildkite via Single Sign-On.',
              'Two-factor authentication cannot be enabled on your account until you reset your password.',
              'Weʼll take you back to your personal settings.'
            ].join('\n\n'));
            location.assign('/user/settings');
            return;
          }
          break;

        case GraphQLErrors.ESCALATION_ERROR:
          // Reload the page so that the backend can prompt to escalate the current session for us
          location.reload();
          return;

        default:
          break;
      }
    }

    alert(error);
  };

  handleActivateSubmit = (event) => {
    event.preventDefault();

    this.setState({ activatingTOTP: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation configureActivateMutation($input: TOTPActivateInput!) {
            totpActivate(input: $input) {
              clientMutationId
              viewer {
                totp {
                  id
                }
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
      if (error.source && error.source.type) {
        switch (error.source.type) {
          case GraphQLErrors.ESCALATION_ERROR:
            location.reload();
            return;

          case GraphQLErrors.RECORD_VALIDATION_ERROR:
            this.setState({
              activatingTOTP: false,
              errors: error.source.errors
            });
            return;

          default:
            break;
        }
      } else {
        alert(error);
      }
    }

    this.setState({
      generatingTOTP: false
    });
  };

  handleRequestClose = () => {
    this.setState({
      generatingTOTP: false
    });
  }
}

export default createFragmentContainer(TwoFactorConfigure, {
  viewer: graphql`
    fragment configure_viewer on Viewer {
      totp {
        id
      }
    }
  `
});
