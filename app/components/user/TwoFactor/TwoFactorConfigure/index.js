// @flow

import * as React from "react";
import { createRefetchContainer, graphql, fetchQuery, commitMutation } from 'react-relay/compat';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import PageHeader from "app/components/shared/PageHeader";
import Icon from "app/components/shared/Icon";
import WorkflowProgress from "app/components/shared/WorkflowProgress";
import TwoFactorConfigureRecoveryCodes from './TwoFactorConfigureRecoveryCodes';
import TwoFactorConfigureActivate from './TwoFactorConfigureActivate';
import TotpCreateMutation from './TotpCreateMutation';
import TotpDeleteMutation from './TotpDeleteMutation';
// Required for Relay fragments...
import TwoFactor from 'app/components/user/TwoFactor'; // eslint-disable-line
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line
import type { RelayProp } from 'react-relay';
import type { TwoFactorConfigure_viewer } from './__generated__/TwoFactorConfigure_viewer.graphql';

const STEPS = {
  RECOVERY_CODES: 'RECOVERY_CODES',
  ACTIVATE_TOTP: 'ACTIVATE_TOTP',
  COMPLETE: 'COMPLETE'
};

type StepType = $Keys<typeof STEPS>;
type TotpType = $PropertyType<TotpType, 'totp'>;
type RecoveryCodesType = $PropertyType<TotpType, 'recoveryCodes'>;


function getNextStep(currentStep: StepType): ?StepType {
  switch (currentStep) {
    case STEPS.RECOVERY_CODES: return STEPS.ACTIVATE_TOTP;
    case STEPS.ACTIVATE_TOTP: return STEPS.COMPLETE;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

type Props = {
  relay: RelayProp,
  viewer: TwoFactorConfigure_viewer,
  onConfigurationComplete: () => void
};

type State = {
  step: StepType,
  didActivateNewOtp: boolean,
  newTotpConfig: ?{
    totp: TotpType,
    provisioningUri: string
  }
};

class TwoFactorConfigure extends React.Component<Props, State> {
  state = {
    step: STEPS.RECOVERY_CODES,
    newTotpConfig: null,
    didActivateNewOtp: false
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
    return [STEPS.RECOVERY_CODES, STEPS.ACTIVATE_TOTP];
  }

  currentStepIndex(currentStep: StepType): number {
    return this.steps.indexOf(currentStep);
  }

  getStepTitle(): string {
    if (this.state.step === STEPS.RECOVERY_CODES) {
      return 'Step 1: Save Recovery Codes';
    }
    return 'Step 2: Configure Authenticator Application';
  }

  getStepNotice(): string {
    if (this.state.step === STEPS.RECOVERY_CODES && this.hasActivatedTotp) {
      return "Youʼre about to reconfigure two-factor authentication. \
      This will invalidate your existing configuration and recovery codes."
    }
  }

  componentWillUnmount() {
    if (this.state.newTotpConfig && !this.state.didActivateNewOtp) {
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
      <div className="p4">
        {this.renderStepNotice()}
        <div class="flex items-top mb3">
          <div class="flex-auto">
            <div class="flex">
              <Icon icon="two-factor" className="mr1" />
              <h1 className="m0 h2 semi-bold">Activate Two-Factor Authentication</h1>
            </div>
            <h2 className="m0 mt3 h4 bold mb5">{this.getStepTitle()}</h2>
          </div>
          <WorkflowProgress
            stepCount={this.steps.length}
            currentStepIndex={this.currentStepIndex(this.state.step)}
          />
        </div>
        <div>
          {this.renderCurrentStep()}
        </div>
      </div>
    );
  }

  renderStepNotice() {
    const notice = this.getStepNotice();

    if (notice) {
      return (
        <div class="mb4 border orange rounded border-orange p3">
          <div class="bold mb1">Heads up!</div>
          <div>{notice}</div>
        </div>
      )
    }
  }

  renderCurrentStep() {
    switch (this.state.step) {
      case STEPS.RECOVERY_CODES:
        return (
          <TwoFactorConfigureRecoveryCodes
            onNextStep={this.handleNextStep}
            recoveryCodes={this.recoveryCodes}
            onCreateNewTotp={this.handleCreateNewTotp}
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
    }
  }

  handleNextStep = () => {
    const step = getNextStep(this.state.step);
    if (step) {
      this.setState({ step });
    }
  }

  refetchTotpById = (id: string): Promise<*> => {
    return fetchQuery(
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
        id
      }
    );
  }

  handleCreateNewTotp = (callback?: () => void) => {
    TotpCreateMutation({
      environment: this.props.relay.environment,
      onCompleted: ({ totpCreate }) => {
        this.refetchTotpById(totpCreate.totp.id).then(({ viewer: { totp } }) => {
          this.setState({ newTotpConfig: { totp, provisioningUri: totpCreate.provisioningUri } }, () => {
            if (callback) {
              callback();
            }
          });
        });
      }
    });
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
          this.setState({ didActivateNewOtp: true }, () => {
            this.props.onConfigurationComplete();
            if (callback) {
              callback();
            }
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
            callback();
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
