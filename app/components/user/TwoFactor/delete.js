// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';

import Button from '../../shared/Button';
import PageHeader from "../../shared/PageHeader";
import Panel from '../../shared/Panel';
import Icon from "../../shared/Icon";

type ViewerType = {
  totp: ?{
    id: string
  }
};

type Props = {
  viewer: ViewerType,
  relay: Object
};

type State = {
  deletingTOTP: boolean,
  deletedTOTP: boolean
};

type TOTPDeleteType = {
  viewer: ViewerType
};

class TwoFactorDelete extends React.PureComponent<Props, State> {
  state = {
    deletingTOTP: false,
    deletedTOTP: false
  };

  render() {
    return (
      <DocumentTitle title={`Remove Two-Factor Authentication`}>
        <div className="container">
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="placeholder"
                style={{ width: 34, height: 34, marginTop: 3, marginLeft: 3 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Remove Two-Factor Authentication
            </PageHeader.Title>
            <PageHeader.Description>
              Stop Two-Factor Authentication protecting from your account.
            </PageHeader.Description>
            <PageHeader.Menu>
              <Button
                theme="success"
                link="/user/two-factor"
                disabled={this.state.deletingTOTP}
              >
                Back to Two-factor authentication settings
              </Button>
            </PageHeader.Menu>
          </PageHeader>

          {this.renderCurrentStatus()}
        </div>
      </DocumentTitle>
    );
  }

  renderCurrentStatus() {
    if (this.state.deletedTOTP) {
      return this.renderDeletedStatus();
    }

    if (!this.props.viewer.totp) {
      return (
        <Panel>
          <Panel.Section>
            Two-factor authentication is not currently activated on your account, so we canʼt deactivate it!
            <Button
              theme="success"
              link="/user/two-factor"
            >
              Back to Two-factor authentication settings
            </Button>
          </Panel.Section>
        </Panel>
      );
    }

    return (
      <Panel>
        <Panel.Section>
          <p>Two-factor authentication is currently activated.</p>
          <p>We recommend keeping Two-factor authentication activated to help secure your account.</p>
        </Panel.Section>
        <Panel.Section>
          <p>Need to move to a new device, or suspect your TOTP tokens are compromised? You can simply reconfigure two-factor authentication.</p>
          <Button
            theme="success"
            link="/user/two-factor/configure"
            disabled={this.state.deletingTOTP}
          >
            Reconfigure Two-Factor Authentication
          </Button>
        </Panel.Section>
        <Panel.Section>
          <p>Removing two-factor authentication will take effect immediately. You may reconfigure two-factor authentication at any time.</p>
          <Button
            theme="error"
            outline={true}
            onClick={this.handleDeleteClick}
            loading={this.state.deletingTOTP && "Removing two-factor authentication…"}
          >
            Remove Two-Factor Authentication
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  renderDeletedStatus() {
    return (
      <Panel>
        <Panel.Section>
          <p>Two-factor authentication has been removed from your account.</p>
        </Panel.Section>
        <Panel.Section>
          <p>Need to move to a new device, or suspect your TOTP tokens are compromised? You can simply reconfigure two-factor authentication.</p>
          <Button
            theme="success"
            link="/user/two-factor/configure"
          >
            Reconfigure Two-Factor Authentication
          </Button>
        </Panel.Section>
      </Panel>
    );
  }

  handleDeleteClick = () => {
    if (!this.props.viewer.totp) {
      throw new Error('TOTP Deactivate called without an active TOTP configuration (This should not be possible!)');
    }

    const totpId = this.props.viewer.totp.id;

    this.setState({ deletingTOTP: true }, () => {
      commitMutation(this.props.relay.environment, {
        mutation: graphql`
          mutation TwoFactorDeactivateDeleteMutation($input: TOTPDeleteInput!) {
            totpDelete(input: $input) {
              clientMutationId
              viewer {
                totp
              }
            }
          }
        `,
        variables: { input: { id: totpId } },
        onCompleted: this.handleDeleteMutationComplete,
        onError: this.handleDeleteMutationError
      });
    });
  };

  handleDeleteMutationComplete = (totpDelete: TOTPDeleteType) => {
    this.setState({
      deletingTOTP: false,
      deletedTOTP: !totpDelete.viewer.totp
    });
  };

  handleDeleteMutationError = (error) => {
    if (error) {
      // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
      //   this.setState({ errors: error.source.errors });
      // } else {
      alert(error);
      // }
    }
  };
}

export default createFragmentContainer(TwoFactorDelete, {
  viewer: graphql`
    fragment TwoFactorDelete_viewer on Viewer {
      totp {
        id
      }
    }
  `
});
