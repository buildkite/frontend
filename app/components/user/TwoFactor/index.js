// @flow

import * as React from "react";
import DocumentTitle from 'react-document-title';
import { createFragmentContainer, graphql } from 'react-relay/compat';

import Badge from '../../shared/Badge';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import Icon from "../../shared/Icon";
import PageHeader from "../../shared/PageHeader";
import Panel from '../../shared/Panel';

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
      <DocumentTitle title={`Two-Factor Authentication`}>
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
            {this.renderHeaderAction()}
          </PageHeader>

          {this.renderCurrentStatus()}
          <RecoveryCodes totp={this.props.viewer.totp} />

          <a
            className="blue hover-navy text-decoration-none hover-underline"
            href="/user/settings"
          >
            Back to Personal Settings
          </a>
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

  renderHeaderAction() {
    if (this.props.viewer.totp) {
      return (
        <PageHeader.Menu>
          <Button
            theme="error"
            outline={true}
            link="/user/two-factor/delete"
          >
            Remove
          </Button>
        </PageHeader.Menu>
      );
    }

    return (
      <PageHeader.Menu>
        <Button
          theme="success"
          link="/user/two-factor/configure"
        >
          Get Started
        </Button>
      </PageHeader.Menu>
    );
  }

  renderCurrentStatus() {
    return (
      <Panel className="mb4">
        <Panel.Section>
          <p>Two-factor authentication is currently {this.props.viewer.totp ? 'active' : 'inactive'}.</p>
          <Button
            theme="success"
            link="/user/two-factor/configure"
          >
            {this.props.viewer.totp ? 'Reconfigure' : 'Get Started with'} Two-Factor Authentication
          </Button>
        </Panel.Section>
      </Panel>
    );
  }
}

export default createFragmentContainer(TwoFactorIndex, {
  viewer: graphql`
    fragment TwoFactor_viewer on Viewer {
      totp {
        ...RecoveryCodes_totp
        id
      }
    }
  `
});
