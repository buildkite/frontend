// @flow

import * as React from "react";
import { createRefetchContainer, graphql, fetchQuery, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import Icon from "app/components/shared/Icon";
import PageHeader from "app/components/shared/PageHeader";
import WorkflowProgress from "app/components/shared/WorkflowProgress";
import TwoFactorConfigureReconfigure from './TwoFactorConfigureReconfigure';
import TwoFactorConfigureRecoveryCodes from './TwoFactorConfigureRecoveryCodes';
import TwoFactorConfigureActivate from './TwoFactorConfigureActivate';
import TwoFactorConfigureComplete from './TwoFactorConfigureComplete';
import TotpCreateMutation from './TotpCreateMutation';
import TotpDeleteMutation from './TotpDeleteMutation';
import type { RelayProp } from 'react-relay';
import type { TwoFactorConfigure_viewer } from './__generated__/TwoFactorConfigure_viewer.graphql';
// Required for Relay fragments...
import TwoFactor from 'app/components/user/TwoFactor'; // eslint-disable-line
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line

const STEPS = {
  RECONFIGURE: 'RECONFIGURE',
  RECOVERY_CODES: 'RECOVERY_CODES',
  ACTIVATE_TOTP: 'ACTIVATE_TOTP',
  COMPLETE: 'COMPLETE'
};

// const AUTHENTICATORS = {
//   '1Password': 'https://1password.com',
//   'OTP Auth': 'https://cooperrs.de/otpauth.html',
//   'Duo Mobile': 'https://duo.com/product/trusted-users/two-factor-authentication/duo-mobile',
//   'Authy': 'https://authy.com',
//   'Google Authenticator': 'https://support.google.com/accounts/answer/1066447'
// };

type StepType = $Keys<typeof STEPS>;
type TotpType = $PropertyType<TotpType, 'totp'>;
type RecoveryCodesType = $PropertyType<TotpType, 'recoveryCodes'>;

function getNextStep(currentStep: StepType): ?StepType {
  switch (currentStep) {
    case STEPS.RECONFIGURE: return STEPS.RECOVERY_CODES;
    case STEPS.RECOVERY_CODES: return STEPS.ACTIVATE_TOTP;
    case STEPS.ACTIVATE_TOTP: return STEPS.COMPLETE;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

type Props = {
  relay: RelayProp,
  viewer: TwoFactorConfigure_viewer
};

type State = {
  step: StepType,
  newTotpConfig: ?Object
};

class TwoFactorConfigure extends React.Component<Props, State> {
  state = {
    step: (this.props.viewer.totp ? STEPS.RECONFIGURE : STEPS.RECOVERY_CODES),
    newTotpConfig: null
  };

  get recoveryCodes(): RecoveryCodesType {
    if (this.state.newTotpConfig) {
      return this.state.newTotpConfig.totp.recoveryCodes;
    }
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes;
    }
    return null;
  }

  get provisioningUri(): string {
    if (this.state.newTotpConfig) {
      return this.state.newTotpConfig.provisioningUri;
    }
    return '';
  }

  get hasActivatedTotp(): boolean {
    return this.props.viewer.totp ? true : false;
  }

  get steps(): Array<StepType> {
    if (this.hasActivatedTotp) {
      return [STEPS.RECONFIGURE, STEPS.RECOVERY_CODES, STEPS.ACTIVATE_TOTP, STEPS.COMPLETE];
    }
    return [STEPS.RECOVERY_CODES, STEPS.ACTIVATE_TOTP, STEPS.COMPLETE];
  }

  currentStepIndex(currentStep: StepType): number {
    return this.steps.indexOf(currentStep);
  }

  componentWillUnmount() {
    if (this.state.newTotpConfig) {
      TotpDeleteMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            id: this.state.newTotpConfig.totp.id
          }
        }
      });
    }
  }

  render() {
    return (
      <DocumentTitle title="Configure Two-Factor Authentication">
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
              <WorkflowProgress
                className="mr4"
                stepCount={this.steps.length}
                currentStepIndex={this.currentStepIndex(this.state.step)}
              />
              {this.state.step === STEPS.COMPLETE ? (
                <Button theme="success" outline={true} link="/user/two-factor">Done</Button>
              ) : (
                <Button theme="default" outline={true} link="/user/two-factor">Cancel</Button>
              )}
            </PageHeader.Menu>
          </PageHeader>
          <div className="col-12 lg-col-7 mx-auto">

            { <pre><code>{JSON.stringify(this.state, null, 2)}</code></pre> }
            { <pre><code>{JSON.stringify(this.props.viewer, null, 2)}</code></pre> }

            {this.renderCurrentStep()}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStep() {
    switch (this.state.step) {
      case STEPS.RECONFIGURE:
        return (
          <TwoFactorConfigureReconfigure
            onNextStep={this.handleNextStep}
            hasActivatedTotp={this.hasActivatedTotp}
          />
        );
      case STEPS.RECOVERY_CODES:
        return (
          <TwoFactorConfigureRecoveryCodes
            onNextStep={this.handleNextStep}
            recoveryCodes={this.recoveryCodes}
            onCreateNewTotp={this.handleCreateNewTotp}
            onRegenerateRecoveryCodes={this.handleRegenerateRecoveryCodes}
          />
        );
      case STEPS.ACTIVATE_TOTP:
        return (
          <TwoFactorConfigureActivate
            onNextStep={this.handleNextStep}
            hasActivatedTotp={this.hasActivatedTotp}
            provisioningUri={this.provisioningUri}
            onActivateOtp={this.handleActivateOtp}
          />
        );
      case STEPS.COMPLETE:
        return (
          <TwoFactorConfigureComplete
            onNextStep={this.handleNextStep}
          />
        );
    }
  }

  handleNextStep = () => {
    const step = getNextStep(this.state.step);
    if (step) {
      this.setState({ step });
    }
  }

  handleCreateNewTotp = (callback?: () => void) => {
    TotpCreateMutation({
      environment: this.props.relay.environment,
      onCompleted: ({ totpCreate }) => {
        fetchQuery(
          this.props.relay.environment,
          graphql`
            query TwoFactorConfigureRefetchNewTotpConfigQuery($id: ID!) {
              viewer {
                totp(id: $id) {
                  id
                  recoveryCodes {
                    ...TwoFactorConfigureRecoveryCodes_recoveryCodes
                  }
                }
              }
            }
          `,
          {
            id: totpCreate.totp.id
          }
        ).then(({ viewer: { totp } }) => {
          this.setState({ newTotpConfig: { totp, provisioningUri: totpCreate.provisioningUri } }, () => {
            if (callback) {
              callback();
            }
          });
        });
      }
    });
  }

  handleRegenerateRecoveryCodes = (callback?: () => void) => {
    if (this.props.viewer.totp) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorConfigureRecoveryCodeRegenerationMutation($input: TOTPRecoveryCodesRegenerateInput!) {
            totpRecoveryCodesRegenerate(input: $input) {
              totp {
                id
              }
            }
          }
        `,
        variables: { input: { id: this.props.viewer.totp.id } },
        onCompleted: ({ totpRecoveryCodesRegenerate }) => {
          this.props.relay.refetch({ id: totpRecoveryCodesRegenerate.totp.id }, null, () => {
            if (callback) {
              callback();
            }
          });
        }
      });
    }
  }

  handleActivateOtp = (token: string, callback?: (errors: *) => void) => {
    if (this.state.newTotpConfig) {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorConfigureActivateMutation($input: TOTPActivateInput!) {
            totpActivate(input: $input) {
              viewer {
                ...TwoFactor_viewer
              }
            }
          }
        `,
        variables: { input: { id: this.state.newTotpConfig.totp.id, token } },
        onCompleted: () => {
          this.props.relay.refetch({}, {}, () => {
            this.setState({ newTotpConfig: null }, () => {
              if (callback) {
                callback();
              }
            });
          });
        },
        onError: (error) => {
          if (error) {
            if (error.source && error.source.type) {
              switch (error.source.type) {
                case GraphQLErrors.ESCALATION_ERROR:
                  location.reload();
                  return;
                case GraphQLErrors.RECORD_VALIDATION_ERROR:
                  if (callback) {
                    callback(error.source.errors);
                  }
                  return;
                default:
                  return;
              }
            } else {
              alert(error);
            }
          }
          if (callback) {
            callback(error.source.errors);
          }
        }
      });
    }
  }
}

export default createRefetchContainer(
  TwoFactorConfigure,
  graphql`
    fragment TwoFactorConfigure_viewer on Viewer {
      id
      totp {
        id
        recoveryCodes {
          ...TwoFactorConfigureRecoveryCodes_recoveryCodes
        }
      }
    }
  `,
  graphql`
    query TwoFactorConfigureRefetchQuery {
      viewer {
        ...TwoFactorConfigure_viewer
      }
    }
  `
);