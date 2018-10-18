// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import Spinner from 'app/components/shared/Spinner';
import type { RecoveryCodeList_recoveryCodes } from './__generated__/RecoveryCodeList_recoveryCodes.graphql';

type Props = {
  isRegeneratingCodes: boolean,
  recoveryCodes: RecoveryCodeList_recoveryCodes
};

class RecoveryCodeList extends React.PureComponent<Props> {
  render() {
    if (!this.props.recoveryCodes.codes) {
      return null;
    }

    return (
      <div className="flex justify-center items-center" style={{ minHeight: "420px" }}>
        {this.props.isRegeneratingCodes ? <Spinner /> : (
          <ul className="list-reset center pb4 my4" style={{ columns: 2 }}>
            {
              this.props.recoveryCodes.codes.map(({ code, consumed }) => (
                <li key={code}>
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
        )}
      </div>
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
