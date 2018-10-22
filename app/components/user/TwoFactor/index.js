// @flow

import * as React from "react";
import DocumentTitle from 'react-document-title';
import { createRefetchContainer, graphql } from 'react-relay/compat';
import Badge from 'app/components/shared/Badge';
// import Dropdown from "app/components/shared/Dropdown";
import Button from 'app/components/shared/Button';
import Dropdown from "../../shared/Dropdown";
import Icon from "app/components/shared/Icon";
import PageHeader from "app/components/shared/PageHeader";
import Panel from 'app/components/shared/Panel';
import RecoveryCodes from './RecoveryCodes';
import RecoveryCodeDialog from './RecoveryCodes/RecoveryCodeDialog';
import type { RelayProp } from 'react-relay';
import type { TwoFactor_viewer } from './__generated__/TwoFactor_viewer.graphql';

type Props = {
  relay: RelayProp,
  viewer: TwoFactor_viewer
};

type State = {
  dialogOpen: boolean
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

class TwoFactor extends React.PureComponent<Props> {
  state = {
    dialogOpen: false
  };

  get recoveryCodesRemaining(): number | null {
    if (this.props.viewer.totp) {
      return this.props.viewer.totp.recoveryCodes.codes
        .filter(({ consumed }) => !consumed)
        .length;
    }
    return null;
  }

  componentDidMount() {
    // this.props.relay.refetch();
  }

  render() {
    return (
      <DocumentTitle title="Two-Factor Authentication">
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="placeholder"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Manage Two-Factor Authentication
            </PageHeader.Title>
            <PageHeader.Description>
              Manage your two-factor authentication settings.
            </PageHeader.Description>
            <PageHeader.Menu>
              <Button theme="default" outline={true} href="/user/settings">
                Back to Personal Settings
              </Button>
            </PageHeader.Menu>
          </PageHeader>
          {this.renderCurrentStatus()}
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStatus() {
    return (
      <React.Fragment>
        <Panel className="mb4">
          <Panel.Header>
            Two-factor authentication is currently {this.props.viewer.totp ? 'active' : 'inactive'}
          </Panel.Header>
          <Panel.Section>
            <p>
              Adding a second authentication mechanism to your account is rad! Words words words about what 2FA is etc Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quos corporis modi quo! Nostrum incidunt fugit laudantium quos rem odit, in obcaecati, ab ipsam voluptatum corrupti dicta itaque earum ipsum praesentium.
            </p>
          </Panel.Section>
          <Panel.Footer>
            <Button theme="success" link="/user/two-factor/configure">
              Get Started
            </Button>
          </Panel.Footer>
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
                      <React.Fragment>
                        <Button theme="warning" className="mx2" outline={true} link="/user/two-factor/configure">
                          Reconfigure
                        </Button>
                        <Button theme="error" outline={true} link="/user/two-factor/delete">
                          Deactivate
                        </Button>
                      </React.Fragment>
                    </div>
                  </Dropdown>
                ) : (
                  <Button
                    theme="success"
                    outline={true}
                    link="/user/two-factor/configure"
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
                {this.state.dialogOpen ? (
                  <RecoveryCodeDialog
                    onRequestClose={this.handleDialogClose}
                    totp={this.props.viewer.totp}
                  />
                ) : null}
              </div>
            </div>
          </Panel.Section>
        </Panel>
      </React.Fragment>
    );
  }

  handleOpenDialogClick = () => {
    this.setState({ dialogOpen: true });
  }

  handleDialogClose = () => {
    this.setState({ dialogOpen: false });
  }
}

export default createRefetchContainer(
  TwoFactor,
  graphql`
    fragment TwoFactor_viewer on Viewer {
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
