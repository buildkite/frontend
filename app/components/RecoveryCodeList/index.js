// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import type { RecoveryCodeList_recoveryCodes } from './__generated__/RecoveryCodeList_recoveryCodes.graphql';

type Props = {
  recoveryCodes: RecoveryCodeList_recoveryCodes
};

class RecoveryCodeList extends React.PureComponent<Props> {
  render() {
    if (!this.props.recoveryCodes.codes) {
      return null;
    }

    return (
      <ul className="list-reset center" style={{ columns: 2 }}>
        {
          this.props.recoveryCodes.codes.map(({ code, consumed }, index) => (
            <li key={index}>
              <code
                className="monospace h2"
                style={{ textDecoration: (consumed ? 'line-through' : 'none') }}
              >
                {code}
              </code>
            </li>
          ))
        }
      </ul>
    );
  }
}

export default createFragmentContainer(RecoveryCodeList, {
  recoveryCodes: graphql`
    fragment RecoveryCodeList_recoveryCodes on RecoveryCodeBatch {
      codes {
        code
        consumed
      }
    }
  `
});
