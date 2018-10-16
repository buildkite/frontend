// @flow

import * as React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import QRCode from 'qrcode.react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import ValidationErrors from 'app/lib/ValidationErrors';
import Button from 'app/components/shared/Button';
import FormTextField from 'app/components/shared/FormTextField';
import PageHeader from "app/components/shared/PageHeader";
import Panel from 'app/components/shared/Panel';
import Icon from "app/components/shared/Icon";
import Spinner from 'app/components/shared/Spinner';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import buildkiteqr from './buildkite.svg';

type Props = {
  viewer: {
    totp: ?{
      id: string,
      recoveryCodes: ?{
        codes: Array<string>
      }
    }
  },
  relay: Object
};

type State = {
  errors: ?[],
  generatingTOTP: boolean,
  generatedTOTP: boolean,
  copiedRecoveryCodes: boolean,
  confirmedRecoveryCodes: boolean,
  activatingTOTP: boolean,
  activatedTOTP: boolean,
  totpId: ?string,
  provisioningUri: ?string,
  recoveryCodes: ?{
    codes: Array<string>
  },
  totpToken: string
};

type TOTPCreateReturnType = {
  totpCreate: {
    provisioningUri: string,
    totp: {
      id: string,
      recoveryCodes: ?{
        codes: Array<string>
      }
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
  Object.keys(AUTHENTICATORS).map((authenticatorName) => (
    <a
      className="blue hover-navy text-decoration-none hover-underline"
      key={authenticatorName}
      href={AUTHENTICATORS[authenticatorName]}
      target="_blank"
      rel="noopener noreferrer"
    >
      {authenticatorName}
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
    copiedRecoveryCodes: false,
    confirmedRecoveryCodes: false,
    activatingTOTP: false,
    activatedTOTP: false,
    totpId: null,
    provisioningUri: null,
    recoveryCodes: null,
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
    } else if (this.state.generatedTOTP && this.state.recoveryCodes && this.state.recoveryCodes.codes && !this.state.confirmedRecoveryCodes) {
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

            <p>Recovery codes are used if you lose access to your code generator.</p>

            <p>Copy or print your recovery codes before you continue to configure two-factor authentication.</p>

            <RecoveryCodeList recoveryCodes={this.state.recoveryCodes} />

            <p>These codes should be treated just like your password. Weʼd suggest saving them into a secure password manager.</p>

            <CopyToClipboard
              text={this.state.recoveryCodes.codes.join('\n')}
              onCopy={this.handleRecoveryCodeCopy}
            >
              <Button
                className="col-12"
                theme="success"
                outline={this.state.copiedRecoveryCodes}
              >
                {this.state.copiedRecoveryCodes
                  ? 'Copied Recovery Codes'
                  : 'Copy Recovery Codes'}
              </Button>
            </CopyToClipboard>
          </Panel.Section>

          <Button
            className="col-12"
            theme="success"
            onClick={this.handleRecoveryCodeRegeneration}
          >
              Regenerate Recovery Codes
          </Button>

          <Panel.Section>
            <Button
              className="col-12"
              theme={this.state.copiedRecoveryCodes ? 'success' : 'default'}
              outline={!this.state.copiedRecoveryCodes}
              onClick={this.handleContinueClick}
            >
              Continue
            </Button>
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

            <figure style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img style={{ position: 'absolute' }} src={buildkiteqr} />
              <QRCode
                renderAs="svg"
                fgColor="currentColor"
                bgColor="transparent"
                width="300"
                height="300"
                className="block my4 mx-auto"
                level="H" // approx 30% error correction
                style={{
                  maxWidth: '100%'
                }}
                value={this.state.provisioningUri}
              />
            </figure>

            <code>{this.state.provisioningUri}</code>

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
        mutation TwoFactorConfigureCreateMutation($input: TOTPCreateInput!) {
          totpCreate(input: $input) {
            clientMutationId
            provisioningUri
            totp {
              id
              recoveryCodes {
                ...RecoveryCodeList_recoveryCodes
                codes {
                  code
                  consumed
                }
              }
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
          mutation TwoFactorConfigureDeleteMutation($input: TOTPDeleteInput!) {
            totpDelete(input: $input) {
              clientMutationId
            }
          }
        `,
        variables: { input: { id: this.state.totpId } }
      });
    }
  }

  handleRecoveryCodeCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
      return;
    }

    this.setState({ copiedRecoveryCodes: true });
  };

  handleContinueClick = () => {
    this.setState({ confirmedRecoveryCodes: true });
  };

  handleRecoveryCodeRegeneration = () => {
    commitMutation(this.props.relay.environment, {
      mutation: graphql`
        mutation TwoFactorConfigureRecoveryCodeRegenerationMutation($input: TOTPRecoveryCodesRegenerateInput!) {
          totpRecoveryCodesRegenerate(input: $input) {
            clientMutationId
            recoveryCodes {
              ...RecoveryCodeList_recoveryCodes
            }
          }
        }
      `,
      variables: { input: { totpId: this.state.totpId } },
      onCompleted: (response) => {
        this.setState({
          recoveryCodes: {
            codes: response.totpRecoveryCodesRegenerate.recoveryCodes.codes
          }
        });
      }
    });
  }

  handleCodeChange = (event) => {
    this.setState({ totpToken: event.target.value });
  };

  handleCreateMutationComplete = (mutationResult: TOTPCreateReturnType) => {
    this.setState({
      generatingTOTP: false,
      generatedTOTP: true,
      confirmedRecoveryCodes: false,
      totpId: mutationResult.totpCreate.totp.id,
      provisioningUri: mutationResult.totpCreate.provisioningUri,
      recoveryCodes: mutationResult.totpCreate.totp.recoveryCodes,
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
          mutation TwoFactorConfigureActivateMutation($input: TOTPActivateInput!) {
            totpActivate(input: $input) {
              clientMutationId
              viewer {
                totp {
                  id
                  recoveryCodes {
                    ...RecoveryCodeList_recoveryCodes
                    codes {
                      code
                      consumed
                    }
                  }
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
}

export default createFragmentContainer(TwoFactorConfigure, {
  viewer: graphql`
    fragment TwoFactorConfigure_viewer on Viewer {
      totp {
        id
        recoveryCodes {
          ...RecoveryCodeList_recoveryCodes
          codes {
            code
            consumed
          }
        }
      }
    }
  `
});
