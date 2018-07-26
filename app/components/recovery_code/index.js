// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import formatRecoveryCode from './formatter';

type Props = {
  recoveryCodes: {
    codes: Array<string>
  }
};

class RecoveryCodes extends React.PureComponent<Props> {
  render() {
    const recoveryCodes = this.props.recoveryCodes.codes.map((code) => formatRecoveryCode(code));

    return (
      <ul
        className="list-reset center"
        style={{
          columns: 2
        }}
      >
        {recoveryCodes.map((code) => (
          <li key={code}>
            <code className="monospace h2">{code}</code>
          </li>
        ))}
      </ul>
    );
  }
}

export default createFragmentContainer(RecoveryCodes, {
  recoveryCodes: graphql`
    fragment recoveryCode_recoveryCodes on RecoveryCodeBatch {
      codes
    }
  `
});
