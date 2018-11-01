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
  text-decoration: line-through;
`;

type Props = {
  isLoading: boolean,
  recoveryCodes: ?RecoveryCodeList_recoveryCodes
};

class RecoveryCodeList extends React.PureComponent<Props> {
  render() {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: "310px" }}>
        {this.props.isLoading ? <Spinner /> : (
          <List className="list-reset center p4">
            {(this.props.recoveryCodes && this.props.recoveryCodes.codes) ? (
              this.props.recoveryCodes.codes.map(({ code, consumed }) => (
                <ListItem key={code}>
                  {consumed ? (
                    <ConsumedCode className="monospace h2">{code}</ConsumedCode>
                  ) : (
                    <Code className="monospace h2">{code}</Code>
                  )}
                </ListItem>
              ))
            ) : null}
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
