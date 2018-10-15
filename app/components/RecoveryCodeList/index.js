// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';

type Props = {
  recoveryCodes: {
    codes: Array<string>
  }
};

class RecoveryCodeList extends React.PureComponent<Props> {
  render() {
    return (
      <ul
        className="list-reset center"
        style={{
          columns: 2
        }}
      >
        {this.props.recoveryCodes.codes.map((code) => (
          <li key={code}>
            <code className="monospace h2">{code}</code>
          </li>
        ))}
      </ul>
    );
  }
}

export default createFragmentContainer(RecoveryCodeList, {
  recoveryCodes: graphql`
    fragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {
      codes {
        code
        id
        consumed
      }
    }
  `
});
