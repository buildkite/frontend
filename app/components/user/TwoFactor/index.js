// @flow

import * as React from 'react';
import DocumentTitle from 'react-document-title';
import { createRefetchContainer, graphql } from 'react-relay/compat';
import Badge from 'app/components/shared/Badge';
import Button from 'app/components/shared/Button';
import Dropdown from 'app/components/shared/Dropdown';
import Icon from 'app/components/shared/Icon';
import PageHeader from 'app/components/shared/PageHeader';
import Panel from 'app/components/shared/Panel';
import Dialog from 'app/components/shared/Dialog';
import TwoFactorConfigure from 'app/components/user/TwoFactor/TwoFactorConfigure';
import {SettingsMenuFragment as SettingsMenu} from 'app/components/user/SettingsMenu';
import RecoveryCodes from './RecoveryCodes'; // eslint-disable-line
import RecoveryCodeList from 'app/components/RecoveryCodeList'; // eslint-disable-line
import RecoveryCodeDialog from './RecoveryCodes/RecoveryCodeDialog';
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
  recoveryCodeDialogOpen: boolean
};


class TwoFactor extends React.PureComponent<Props, State> {
  state = {
    configureDialogOpen: false,
    recoveryCodeDialogOpen: false
  };

  get recoveryCodesRemaining(): number | null {
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes.codes
        .filter(({ consumed }) => !consumed)
        .length;
    }
    return null;
  }

  render() {
    return (
      <DocumentTitle title="Two-Factor Authentication">
        <div className="container">
          <div className="clearfix">
            <div className="col col-3 pr3">
              <SettingsMenu viewer={this.props.viewer} />
            </div>
            <div className="col col-9 pl3">
              <Panel className="mb4">
                <Panel.Header>
                  Two-factor authentication is currently {this.props.viewer.totp ? 'active' : 'inactive'}
                </Panel.Header>
                <Panel.Section>
                  <p>
                    Adding a second authentication mechanism to your account is rad! Words words words about what 2FA is etc Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos corporis modi quo! Nostrum incidunt fugit laudantium quos rem odit, in obcaecati, ab ipsam voluptatum corrupti dicta itaque earum ipsum praesentium.
                  </p>
                </Panel.Section>
              </Panel>
              <Panel className="mb4">
                <Panel.Header>
                  Two-factor Authentication Methods
                </Panel.Header>
                <Panel.Section>
                  <div className="flex items-center">
                    <div className="flex-auto">
                      <header className="flex items-center mb1">
                        {this.props.viewer.totp ? (
                          <Badge className="ml0 mr3 bg-lime">ACTIVE</Badge>
                        ) : (
                          <Badge outline={true} className="ml0 mr3">INACTIVE</Badge>
                        )}
                        <h3 className="h3 m0">Authenticator Application</h3>
                      </header>
                      <p className="m0">
                        Authenticator Applications generate automatically refreshing, single use One Time
                        Passwords (OTPs). Some reliable Authenticator Applications include {AUTHENTICATOR_LIST}.
                      </p>
                    </div>


                    <Dialog
                      isOpen={this.state.configureDialogOpen}
                      width={600}
                      onRequestClose={() => this.setState({configureDialogOpen: false})}
                    >
                      <TwoFactorConfigure viewer={this.props.viewer} />
                    </Dialog>


                    <div className="flex-none col-4 flex justify-end">
                      {this.props.viewer.totp ? (
                        <Dropdown width={270}>
                          <Button
                            theme="default"
                            outline={true}
                          >
                            Settings
                          </Button>
                          <div className="my2 mx3">
                            <p>Maybe have some words here about reconfiguing and deactivation? words words words how great are words words like to party</p>
                            <div>
                              <Button theme="warning" className="mr2" outline={true} link="/user/two-factor/configure">
                                Reconfigure
                              </Button>
                              <Button theme="error" outline={true} link="/user/two-factor/delete">
                                Deactivate
                              </Button>
                            </div>
                          </div>
                        </Dropdown>
                      ) : (
                        <Button
                          theme="success"
                          onClick={() => this.setState({configureDialogOpen: true})}
                        >
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                </Panel.Section>
                <Panel.Section>
                  <div className="flex items-center">
                    <div className="flex-auto">
                      <header className="flex items-center mb1">
                        {this.props.viewer.totp ? (
                          <Badge className="ml0 mr3 bg-lime">ACTIVE</Badge>
                        ) : (
                          <Badge outline={true} className="ml0 mr3">INACTIVE</Badge>
                        )}
                        <h3 className="h3 m0">Recovery Code</h3>
                        {this.props.viewer.totp ? (
                          <span className="ml3">{this.recoveryCodesRemaining} codes remaining</span>
                        ) : null}
                      </header>
                      <p className="m0">
                        Recovery Codes are special, single use codes that allow you to regain access to your account if
                        you’re ever unable to use your configured autheticator application. They’re created when you
                        configure an Authenticator Applicaiton.
                      </p>
                    </div>
                    <div className="flex-none col-4 flex justify-end">
                      {this.props.viewer.totp ? (
                        <Button
                          onClick={this.handleOpenDialogClick}
                          theme="default"
                          outline={true}
                        >
                          View Codes
                          <Badge className="ml2" outline={true}>
                            {this.recoveryCodesRemaining}
                          </Badge>
                        </Button>
                      ) : null}
                      {this.props.viewer.totp && this.state.recoveryCodeDialogOpen ? (
                        <RecoveryCodeDialog
                          onRequestClose={this.handleDialogClose}
                          totp={this.props.viewer.totp}
                        />
                      ) : null}
                    </div>
                  </div>
                </Panel.Section>
              </Panel>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }

  handleOpenDialogClick = () => {
    this.setState({ recoveryCodeDialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ recoveryCodeDialogOpen: false });
  }
}

export default createRefetchContainer(
  TwoFactor,
  graphql`
    fragment TwoFactor_viewer on Viewer {
      ...SettingsMenu_viewer
      ...TwoFactorConfigure_viewer

      totp {
        ...RecoveryCodes_totp
        ...RecoveryCodeDialog_totp

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
