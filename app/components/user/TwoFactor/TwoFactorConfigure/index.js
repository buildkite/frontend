// @flow

import * as React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
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
import Introduction from './TwoFactorConfigureIntroduction';
import RecoveryCodes from './TwoFactorConfigureRecoveryCodes';
// import ConfigureTOTP from './TwoFactorConfigureTOTP';
// import ActivateTOTP from './TwoFactorConfigureActivate';
// import Complete from './TwoFactorConfigureComplete';

import TotpCreateMutation from './TotpCreateMutation';
import TotpDeleteMutation from './TotpDeleteMutation';

import type { TwoFactorConfigure_viewer } from './__generated__/TwoFactorConfigure_viewer.graphql';


const STEPS = {
  INTRODUCTION: 'INTRODUCTION',
  RECOVERY_CODES: 'RECOVERY_CODES',
  CONFIGURE_OTP: 'CONFIGURE_OTP',
  ACTIVATE_TOTP: 'ACTIVATE_TOTP',
  COMPLETE: 'COMPLETE'
};

function getNextStep(currentStep: Step): ?Step {
  switch (currentStep) {
    case STEPS.INTRODUCTION: return STEPS.RECOVERY_CODES;
    case STEPS.RECOVERY_CODES: return STEPS.CONFIGURE_OTP;
    case STEPS.CONFIGURE_OTP: return STEPS.ACTIVATE_TOTP;
    case STEPS.ACTIVATE_TOTP: return STEPS.COMPLETE;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

function getPreviousStep(currentStep: Step): ?Step {
  switch (currentStep) {
    case STEPS.INTRODUCTION: return STEPS.INTRODUCTION;
    case STEPS.RECOVERY_CODES: return STEPS.INTRODUCTION;
    case STEPS.CONFIGURE_OTP: return STEPS.RECOVERY_CODES;
    case STEPS.ACTIVATE_TOTP: return STEPS.CONFIGURE_OTP;
    case STEPS.COMPLETE: return STEPS.COMPLETE;
  }
}

type Step = $Keys<typeof STEPS>;

type Props = {
  relay: *, // TODO
  viewer: TwoFactorConfigure_viewer
};

type State = {
  step: Step,
  generatedTotp: any
};

class TwoFactorConfigure extends React.PureComponent<Props, State> {
  state = {
    step: STEPS.INTRODUCTION,
    generatedTotp: null
  };

  // get recoveryCodes() {
  //   if (this.props.viewer.totp) {
  //     return this.props.viewer.totp.recoveryCodes;
  //   }
  //   if (this.state.generatedTotp) {
  //     return this.state.generatedTotp.recoveryCodes;
  //   }
  // }

  get hasExistingTotp(): boolean {
    return this.props.viewer.totp ? true : false;
  }

  get hasGeneratedTotp(): boolean {
    return this.state.generatedTotp ? true : false;
  }

  hasTotp(): boolean {
    return this.hasExistingTotp || this.hasGeneratedTotp;
  }

  componentDidMount() {
    if (!this.hasExistingTotp) {
      TotpCreateMutation({
        environment: this.props.relay.environment,
        onCompleted: ({ totpCreate }) => this.setState({ generatedTotp: totpCreate.totp })
      });
    }
  }

  componentWillUnmount() {
    if (this.state.generatedTotp) {
      TotpDeleteMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            id: this.state.generatedTotp.id
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
              PROGRESS BAR: {this.state.step}
              <Button theme="default" outline={true} link="/user/two-factor">
                Cancel
              </Button>
            </PageHeader.Menu>
          </PageHeader>
          <div className="col-12 lg-col-6 mx-auto">
            {this.hasTotp() ? this.renderCurrentStep() : (
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
      handlePreviousStep: this.handlePreviousStep,
      handleNextStep: this.handleNextStep
    };

    switch (this.state.step) {
      case STEPS.INTRODUCTION:
        return <Introduction {...props} hasExistingTotp={this.hasExistingTotp} />;
      case STEPS.RECOVERY_CODES:
        return <RecoveryCodes {...props} recoveryCodes={this.state.generatedTotp.recoveryCodes} />;
      // case STEPS.CONFIGURE_OTP:  return <ConfigureTOTP />;
      // case STEPS.ACTIVATE_TOTP:  return <ActivateTOTP />;
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
}

export default createFragmentContainer(TwoFactorConfigure, {
  viewer: graphql`
    fragment TwoFactorConfigure_viewer on Viewer {
      totp {
        id
        recoveryCodes {
          ...RecoveryCodeList_recoveryCodes
        }
      }
    }
  `
});
