// @flow

import * as React from "react";
import { createFragmentContainer, createRefetchContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import Spinner from 'app/components/shared/Spinner';
import Icon from "app/components/shared/Icon";
// import Panel from 'app/components/shared/Panel';
// import Icon from "app/components/shared/Icon";
// import Spinner from 'app/components/shared/Spinner';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import PageHeader from "app/components/shared/PageHeader";
import WorkflowProgress from "app/components/shared/WorkflowProgress";
import Introduction from './TwoFactorConfigureIntroduction';
import RecoveryCodes from './TwoFactorConfigureRecoveryCodes';
import ActivateTOTP from './TwoFactorConfigureActivate';
// import Complete from './TwoFactorConfigureComplete';
import TotpCreateMutation from './TotpCreateMutation';
import TotpDeleteMutation from './TotpDeleteMutation';
import type { RelayProp } from 'react-relay';
import type { TwoFactorConfigure_viewer } from './__generated__/TwoFactorConfigure_viewer.graphql';

const STEPS = {
  // INTRODUCTION: 'INTRODUCTION',
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
    // case STEPS.INTRODUCTION: return STEPS.RECOVERY_CODES;
    case STEPS.RECOVERY_CODES: return STEPS.ACTIVATE_TOTP;
    case STEPS.ACTIVATE_TOTP: return STEPS.COMPLETE;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

function getPreviousStep(currentStep: StepType): ?StepType {
  switch (currentStep) {
    // case STEPS.INTRODUCTION: return STEPS.INTRODUCTION;
    case STEPS.RECOVERY_CODES: return STEPS.RECOVERY_CODES;
    case STEPS.ACTIVATE_TOTP: return STEPS.RECOVERY_CODES;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

function currentStepIndex(currentStep: StepType): number {
  switch (currentStep) {
    // case STEPS.INTRODUCTION: return 1;
    case STEPS.RECOVERY_CODES: return 1;
    case STEPS.ACTIVATE_TOTP: return 2;
    case STEPS.COMPLETE: return 3;
    default: return -1;
  }
}

type Props = {
  relay: RelayProp,
  viewer: TwoFactorConfigure_viewer
};

type State = {
  step: StepType,
  didGeneratedTotp: boolean,
  provisioningUri: string
};

class TwoFactorConfigure extends React.PureComponent<Props, State> {
  state = {
    step: STEPS.RECOVERY_CODES,
    didGeneratedTotp: false,
    provisioningUri: ''
  };

  get recoveryCodes(): RecoveryCodesType {
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes;
    }
    return null;
  }

  get hasTotp(): boolean {
    return this.props.viewer.totp ? true : false;
  }

  get didGenerateTotp(): boolean {
    return this.state.didGeneratedTotp;
  }

  componentDidMount() {
    if (!this.hasTotp) {
      TotpCreateMutation({
        environment: this.props.relay.environment,
        onCompleted: ({ totpCreate }) => {
          this.props.relay.refetch({ totpId: totpCreate.totp.id }, null, () => {
            this.setState({
              didGeneratedTotp: true,
              provisioningUri: totpCreate.provisioningUri
            });
          });
        }
      });
    }
  }

  componentWillUnmount() {
    if (this.state.didGeneratedTotp && this.props.viewer.totp) {
      TotpDeleteMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            id: this.props.viewer.totp.id
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
                stepCount={Object.keys(STEPS).length}
                currentStepIndex={currentStepIndex(this.state.step)}
              />
              <Button theme="default" outline={true} link="/user/two-factor">
                Cancel
              </Button>
            </PageHeader.Menu>
          </PageHeader>
          <div className="col-12 lg-col-7 mx-auto">
            {this.hasTotp ? this.renderCurrentStep() : (
              <React.Fragment>
                <Spinner />
                Getting ready to {this.props.viewer.totp ? 'reconfigure' : 'configure'} two-factor authentication…
              </React.Fragment>
            )}
          </div>
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStep() {
    const props = {
      onPreviousStep: this.handlePreviousStep,
      onNextStep: this.handleNextStep
    };

    switch (this.state.step) {
      // case STEPS.INTRODUCTION:
      //   return (
      //     <Introduction
      //       {...props}
      //       hasExistingTotp={!this.didGenerateTotp}
      //     />
      //   );
      case STEPS.RECOVERY_CODES:
        return (
          <RecoveryCodes
            {...props}
            recoveryCodes={this.recoveryCodes}
            onRegenerateRecoveryCodes={this.handleRegenerateRecoveryCodes}
          />
        );
      case STEPS.ACTIVATE_TOTP:
        return (
          <ActivateTOTP
            {...props}
            hasExistingTotp={!this.didGenerateTotp}
            provisioningUri={this.state.provisioningUri}
            onActivateOtp={this.handleActivateOtp}
          />
        );
      // case STEPS.COMPLETE:       return <Complete />;
    }
  }

  handlePreviousStep = () => {
    const step = getPreviousStep(this.state.step);
    if (step) {
      this.setState({ step });
    }
  }

  handleNextStep = () => {
    const step = getNextStep(this.state.step);
    if (step) {
      this.setState({ step });
    }
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
        variables: { input: { totpId: this.props.viewer.totp.id } },
        onCompleted: ({ totpRecoveryCodesRegenerate }) => {
          this.props.relay.refetch({ totpId: totpRecoveryCodesRegenerate.totp.id }, null, () => {
            if (callback) {
              callback();
            }
          });
        }
      });
    }
  }

  handleActivateOtp = (token: string, callback?: () => void) => {
    if (this.props.viewer.totp) {
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
        variables: { input: { id: this.props.viewer.totp.id, token } },
        onCompleted: () => {
          if (callback) {
            callback();
          }
        },
        onError: (error) => {
          if (error) {
            if (error.source && error.source.type) {
              switch (error.source.type) {
                case GraphQLErrors.ESCALATION_ERROR:
                  location.reload();
                  return;
                case GraphQLErrors.RECORD_VALIDATION_ERROR:
                  return this.setState({ isActivating: false, errors: error.source.errors });
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
    fragment TwoFactorConfigure_viewer on Viewer @argumentDefinitions(totpId: {type: "ID"}) {
      totp(id: $totpId) {
        id
        recoveryCodes {
          ...RecoveryCodeList_recoveryCodes
        }
      }
    }
  `,
  graphql`
    query TwoFactorConfigureRefetchQuery($totpId: ID!) {
      viewer {
        ...TwoFactorConfigure_viewer @arguments(totpId: $totpId)
      }
    }
  `
);