// @flow

import * as React from 'react';
import { createFragmentContainer, graphql, commitMutation } from 'react-relay/compat';
import Button from 'app/components/shared/Button';
import RecoveryCodeList from 'app/components/RecoveryCodeList';
import type { RecoveryCodes_totp } from './__generated__/RecoveryCodes_totp.graphql';
import type { RelayProp } from 'react-relay';

type Props = {
  relay: RelayProp,
  totp: RecoveryCodes_totp
};

type State = {
  copiedRecoveryCodes: boolean,
  generatingNewCodes: boolean
};

class RecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    copiedRecoveryCodes: false,
    generatingNewCodes: false
  }

  render() {
    return (
      <div className="p4">
        <h2 className="m0 h2 semi-bold mb5">Recovery Codes</h2>
        <p>Recovery codes are the only way to get access to your account if you lose access to your authenticator application.</p>
        <p>Recovery codes should be treated like your password. We suggest saving them in a secure password manager, or printing them and storing them somewhere safe.</p>
        <RecoveryCodeList
          recoveryCodes={this.props.totp.recoveryCodes}
          isLoading={this.state.generatingNewCodes}
        />
        <h2 className="m0 mt3 h4 semi-bold mb5">Generate New Recovery Codes</h2>
        <p>When you generate new recovery codes, your previous codes will no longer be valid. Please ensure you save a copy of your new recovery codes after they’ve been generated.</p>
        <Button
          className="col-12"
          theme="default"
          outline={true}
          onClick={this.handleRegenerateRecoveryCodes}
          loading={this.state.generatingNewCodes && "Generating New Recovery Codes…"}
          disabled={this.state.generatingNewCodes}
        >
          Generate New Recovery Codes
        </Button>
      </div>
    );
  }

  handleRegenerateRecoveryCodes = () => {
    this.setState({ generatingNewCodes: true });

    commitMutation(this.props.relay.environment, {
      mutation: graphql`
          mutation RecoveryCodesRegenerateMutation($input: TOTPRecoveryCodesRegenerateInput!) {
            totpRecoveryCodesRegenerate(input: $input) {
              totp {
                id
                recoveryCodes {
                  id
                  codes {
                    code
                    consumed
                  }
                }
              }
            }
          }
        `,
      variables: { input: { totpId: this.props.totp.id } },
      onCompleted: () => {
        this.setState({ generatingNewCodes: false });
      },
      onError: (error) => {
        alert(error);
      }
    });
  }
}

export default createFragmentContainer(RecoveryCodes, {
  totp: graphql`
    fragment RecoveryCodes_totp on TOTP {
      id
      recoveryCodes {
        id
        ...RecoveryCodeList_recoveryCodes
        codes {
          code
          consumed
        }
      }
    }
  `
});
