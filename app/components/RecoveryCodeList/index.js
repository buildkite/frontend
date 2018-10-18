// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import styled from 'styled-components';
import Spinner from 'app/components/shared/Spinner';
import type { RecoveryCodeList_recoveryCodes } from './__generated__/RecoveryCodeList_recoveryCodes.graphql';

const List = styled.ul`
  columns: 2;
  column-gap: 60px;
`;

const ListItem = styled.li`
  display: block;
`;

const Code = styled.span`
  display: block;
`;

const ConsumedCode = styled.span`
  display: block;
  line-through : 'none';
`;


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
      <div className="flex justify-center items-center" style={{ minHeight: "360px" }}>
        {this.props.isRegeneratingCodes ? <Spinner /> : (
          <List className="list-reset center p4">
            {
              this.props.recoveryCodes.codes.map(({ code, consumed }) => (
                <ListItem key={code}>
                  {consumed ? (
                    <ConsumedCode className="monospace h2">{code}</ConsumedCode>
                  ) : (
                    <Code className="monospace h2">{code}</Code>
                  )}
                </ListItem>
              ))
            }
          </List>
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
