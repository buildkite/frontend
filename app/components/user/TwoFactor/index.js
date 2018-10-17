// @flow

import * as React from "react";
import DocumentTitle from 'react-document-title';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Badge from 'app/components/shared/Badge';
import Button from 'app/components/shared/Button';
import Icon from "app/components/shared/Icon";
import PageHeader from "app/components/shared/PageHeader";
import Panel from 'app/components/shared/Panel';
import RecoveryCodes from './RecoveryCodes';

type Props = {
  viewer: {
    totp: ?{
      id: string
    }
  }
};

class TwoFactorIndex extends React.PureComponent<Props> {
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
              Two-Factor Authentication {this.renderBadge()}
            </PageHeader.Title>
            <PageHeader.Description>
              Manage your two-factor authentication settings.
            </PageHeader.Description>
          </PageHeader>
          {this.renderCurrentStatus()}
        </div>
      </DocumentTitle>
    );
  }

  renderBadge() {
    if (!this.props.viewer.totp) {
      return;
    }

    return (
      <Badge className="bg-lime">Active</Badge>
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
                  <Badge outline={true} className="ml0 mr2">{this.props.viewer.totp ? "Active" : "Inactive"}</Badge>
                  <h3 className="h3 m0">Authenticator Application</h3>
                </header>
                <p className="m0">
                  Authenticator Applications generate automatically refreshing, single use One Time
                  Passwords (OTPs). Some reliable Authenticator Applications include; 1Password, Google Authenticator,
                  and Authy.
                </p>
              </div>
              <div className="flex-none col-4 flex justify-end">
                {this.props.viewer.totp ? (
                  <Button theme="error" outline={true} link="/user/two-factor/delete">
                    Deactivate
                  </Button>
                ) : null}
                <Button theme="success" outline={true} link="/user/two-factor/configure">
                  Activate
                </Button>
              </div>
            </div>
          </Panel.Section>

          <Panel.Section>
            <div className="flex items-center">
              <div className="flex-auto">
                <header className="flex items-center mb1">
                  <Badge outline={true} className="ml0 mr2">{this.props.viewer.totp ? "Active" : "Inactive"}</Badge>
                  <h3 className="h3 m0">Recovery Code</h3>
                  {this.props.viewer.totp ? (
                    <span className="ml3">You have 3 codes remaining</span>
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
                  <Button theme="default" outline={true} disabled={true} link="/user/two-factor/configure">
                    View Codes
                  </Button>
                ) : null}
              </div>
            </div>
          </Panel.Section>
        </Panel>
      </React.Fragment>
    );
  }
}

export default createFragmentContainer(TwoFactorIndex, {
  viewer: graphql`
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
  `
});
