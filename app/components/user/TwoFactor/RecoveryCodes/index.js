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
  generatingNewCodes: boolean,
  newCodesAvailable: boolean
};

class RecoveryCodes extends React.PureComponent<Props, State> {
  state = {
    generatingNewCodes: false,
    newCodesAvailable: false
  }

  render() {
    let contents;
    if (this.state.newCodesAvailable) {
      contents = this.renderNewCodesSection();
    } else {
      contents = this.renderGenerateSection();
    }

    return (
      <div className="p4">
        {contents}
      </div>
    );
  }

  renderGenerateSection() {
    return (
      <>
        <h2 className="m0 h2 semi-bold mb5">Generate New Recovery Codes</h2>
        <p>When you generate new recovery codes, your previous codes will no longer be valid. Please ensure you save a copy of your new recovery codes after they’ve been generated.</p>
        <Button
          className="col-12"
          theme="success"
          onClick={this.handleRegenerateRecoveryCodes}
          loading={this.state.generatingNewCodes && "Generating New Recovery Codes…"}
          disabled={this.state.generatingNewCodes}
        >
          Generate New Recovery Codes
        </Button>
      </>
    );
  }

  renderNewCodesSection() {
    return (
      <>
        <div className="mb4 border green rounded border-green p3">
          <div className="bold">Here are your new recovery codes.</div>
          <div>Your codes are no longer valid. Please make sure you store them in a safe place</div>
        </div>

        <div className="mt4">
          <RecoveryCodeList
            recoveryCodes={this.props.totp.recoveryCodes}
          />
        </div>
      </>
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
        this.setState({ newCodesAvailable: true });
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
