// @flow

import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { createRefetchContainer, graphql } from 'react-relay/compat';
import Badge from 'app/components/shared/Badge';
import Button from 'app/components/shared/Button';
import Panel from 'app/components/shared/Panel';
import Dialog from 'app/components/shared/Dialog';
import TwoFactorConfigure from 'app/components/user/TwoFactor/TwoFactorConfigure';
import TwoFactorDelete from 'app/components/user/TwoFactor/TwoFactorDelete';
import { SettingsMenuFragment as SettingsMenu } from 'app/components/user/SettingsMenu';
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line
import RecoveryCodes from './RecoveryCodes';
import type { TwoFactor_viewer } from './__generated__/TwoFactor_viewer.graphql';

function AuthenticatorUrl({ name, url }: {|name: string, url: string|}) {
  return (
    <a
      className="blue hover-navy text-decoration-none hover-underline"
      key={name}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {name}
    </a>
  );
}

function ActiveStateBadge({ active }: {|active: boolean|}) {
  return active ? (
    <Badge className="bg-lime mr2">ACTIVE</Badge>
  ) : (
    <Badge outline={true} className="mr2">INACTIVE</Badge>
  );
}

const AUTHENTICATORS = [
  { name: '1Password', url: 'https://1password.com' },
  { name: 'OTP Auth', url: 'https://cooperrs.de/otpauth.html' },
  { name: 'Duo Mobile', url: 'https://duo.com/product/trusted-users/two-factor-authentication/duo-mobile' },
  { name: 'Authy', url: 'https://authy.com' },
  { name: 'Google Authenticator', url: 'https://support.google.com/accounts/answer/1066447' }
];

const AUTHENTICATOR_LIST = AUTHENTICATORS.reduce((memo, authenticator, index, { length }) => [
  ...memo,
  <AuthenticatorUrl {...authenticator} key={authenticator.name} />,
  ((index < length - 1) ? ((index < length - 2) ? ', ' : ' and ') : '')
], []);

type Props = {
  viewer: TwoFactor_viewer
};

type State = {
  configureDialogOpen: boolean,
  recoveryCodeDialogOpen: boolean,
  deactivateDialogOpen: boolean
};

class TwoFactor extends React.PureComponent<Props, State> {
  state = {
    configureDialogOpen: false,
    recoveryCodeDialogOpen: false,
    deactivateDialogOpen: false
  };

  get recoveryCodesRemaining(): number | null {
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes.codes
        .filter(({ consumed }) => !consumed)
        .length;
    }
    return null;
  }

  hasTotp(): boolean {
    if (this.props.viewer.totp) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <DocumentTitle title="Two-Factor Authentication">
        <React.Fragment>
          <div className="container">
            <div className="clearfix">
              <div className="col col-3 pr3">
                <SettingsMenu viewer={this.props.viewer} />
              </div>
              <div className="col col-9 pl3">
                {(this.props.viewer.user && this.props.viewer.user.hasPassword) ? (
                  <React.Fragment>
                    <Panel className="mb4">
                      <Panel.Header>
                        Two-Factor Authentication Methods
                      </Panel.Header>
                      <Panel.Section>
                        <header className="mb1 flex align-center">
                          <ActiveStateBadge active={this.hasTotp()} />
                          <h3 className="h3 m0">Authenticator Application</h3>
                        </header>
                        <div>
                          <div className="flex">
                            <div className="flex-auto pr3 mr3">
                              <p className="m0">
                                Authenticator applications generate single use One Time Passwords (OTPs).
                                Recommended authenticator applications: {AUTHENTICATOR_LIST}.
                              </p>
                            </div>
                            <div className="flex-none flex flex-column col-3">
                              {this.props.viewer.totp ? (
                                <React.Fragment>
                                  <Button theme="warning" className="mb2 flex-auto" outline={true} onClick={this.handleConfigureDialogClick}>
                                    Reconfigure
                                  </Button>
                                  <Button theme="error" className="flex-auto" outline={true} onClick={this.handleDeactivateDialogClick}>
                                    Deactivate
                                  </Button>
                                </React.Fragment>
                              ) : (
                                <Button theme="success" onClick={this.handleConfigureDialogClick}>
                                  Activate
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Panel.Section>
                      <Panel.Section>
                        <header className="mb1 flex align-center">
                          <ActiveStateBadge active={this.hasTotp()} />
                          <h3 className="h3 m0">Recovery Code</h3>
                          {this.hasTotp() ? <span className="ml3">{this.recoveryCodesRemaining} remaining</span> : null}
                        </header>
                        <div>
                          <div className="flex">
                            <div className="flex-auto pr3 mr3">
                              <p className="m0">
                                Recovery Codes are single use codes that can be used to access to your account if
                                you lose access to your configured authenticator application.
                              </p>
                            </div>
                            <div className="flex-none flex flex-column col-3">
                              {this.props.viewer.totp ? (
                                <Button
                                  onClick={this.handleRecoveryCodeDialogClick}
                                  theme="default"
                                  outline={true}
                                >
                                  View
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Panel.Section>
                    </Panel>
                    <Dialog
                      isOpen={this.state.configureDialogOpen}
                      width={540}
                      onRequestClose={this.handleConfigureDialogClose}
                    >
                      <TwoFactorConfigure
                        viewer={this.props.viewer}
                        onConfigurationComplete={this.handleConfigureDialogClose}
                      />
                    </Dialog>
                    <Dialog
                      isOpen={this.state.deactivateDialogOpen}
                      width={600}
                      onRequestClose={this.handleDeactivateDialogClose}
                    >
                      <TwoFactorDelete
                        viewer={this.props.viewer}
                        onDeactivationComplete={this.handleDeactivateDialogClose}
                      />
                    </Dialog>
                    {this.props.viewer.totp ? (
                      <Dialog
                        isOpen={this.state.recoveryCodeDialogOpen}
                        width={540}
                        onRequestClose={this.handleRecoveryCodeDialogClose}
                      >
                        <RecoveryCodes
                          totp={this.props.viewer.totp}
                        />
                      </Dialog>
                    ) : null}
                  </React.Fragment>
                ) : (
                  <p>
                    You do not have a password set for your account. Two-factor authentication is available without setting a password.
                  </p>
                )}
              </div>
            </div>
          </div>
        </React.Fragment>
      </DocumentTitle>
    );
  }

  handleDeactivateDialogClick = () => {
    this.setState({ deactivateDialogOpen: true });
  }

  handleDeactivateDialogClose = () => {
    this.setState({ deactivateDialogOpen: false });
  }

  handleConfigureDialogClick = () => {
    this.setState({ configureDialogOpen: true });
  }

  handleConfigureDialogClose = () => {
    this.setState({ configureDialogOpen: false });
  }

  handleRecoveryCodeDialogClick = () => {
    this.setState({ recoveryCodeDialogOpen: true });
  }

  handleRecoveryCodeDialogClose = () => {
    this.setState({ recoveryCodeDialogOpen: false });
  }
}

export default createRefetchContainer(
  TwoFactor,
  graphql`
    fragment TwoFactor_viewer on Viewer {
      ...SettingsMenu_viewer
      ...TwoFactorConfigure_viewer
      ...TwoFactorDelete_viewer

      user {
        hasPassword
      }

      totp {
        ...RecoveryCodes_totp

        id
        recoveryCodes {
          codes {
            code
            consumed
          }
        }
      }
    }
  `,
  graphql`
    query TwoFactorRefetchQuery {
      viewer {
        ...TwoFactor_viewer
      }
    }
  `
);
