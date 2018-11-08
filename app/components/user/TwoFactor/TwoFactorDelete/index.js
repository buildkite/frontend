// @flow

import React from "react";
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import GraphQLErrors from 'app/constants/GraphQLErrors';
import Button from 'app/components/shared/Button';
import type { TwoFactorDelete_viewer } from './__generated__/TwoFactorDelete_viewer.graphql';
import type { RelayProp } from 'react-relay';

type Props = {
  viewer: TwoFactorDelete_viewer,
  relay: RelayProp,
  onDeactivationComplete: () => void
};

type State = {
  deletingTOTP: boolean
};


class TwoFactorDelete extends React.PureComponent<Props, State> {
  state = {
    deletingTOTP: false
  };

  render() {
    return (
      <div className="p4">
        <h1 className="m0 h2 semi-bold mb3">Deactivate Two-Factor Authentication</h1>
        <div>
          {this.renderCurrentStatus()}
        </div>
      </div>
    );
  }

  renderCurrentStatus() {
    return (
      <React.Fragment>
        <p>We recommend keeping two-factor authentication active to help secure your account.</p>
        <p>You may reconfigure two-factor authentication at any time.</p>
        <Button
          className="col-12 mt2"
          theme="error"
          onClick={this.handleDeleteClick}
          loading={this.state.deletingTOTP && "Deactivating two-factor authentication…"}
        >
          Deactivate Two-Factor Authentication
        </Button>
      </React.Fragment>
    );
  }

  handleDeleteClick = () => {
    if (this.props.viewer.totp) {
      const totpId = this.props.viewer.totp.id;

      this.setState({ deletingTOTP: true }, () => {
        commitMutation(this.props.relay.environment, {
          mutation: graphql`
            mutation TwoFactorDeleteMutation($input: TOTPDeleteInput!) {
              totpDelete(input: $input) {
                clientMutationId
                viewer {
                  totp {
                    id
                  }
                }
              }
            }
          `,
          variables: { input: { id: totpId } },
          onCompleted: this.handleDeleteMutationComplete,
          onError: this.handleDeleteMutationError
        });
      });
    }
  };

  handleDeleteMutationComplete = () => {
    this.setState({ deletingTOTP: false }, this.props.onDeactivationComplete);
  };

  handleDeleteMutationError = (error) => {
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.ESCALATION_ERROR) {
        location.reload();
      } else {
        // if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        //   this.setState({ errors: error.source.errors });
        // } else {
        alert(JSON.stringify(error));
      }
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
