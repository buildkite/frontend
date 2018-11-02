// @flow

import React from "react";
import { createFragmentContainer, graphql } from 'react-relay/compat';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import Spinner from 'app/components/shared/Spinner';
import Button from 'app/components/shared/Button';
import type { RecoveryCodeList_recoveryCodes } from './__generated__/RecoveryCodeList_recoveryCodes.graphql';

const List = styled.ul`
  columns: 145px;
  column-gap: 60px;
  width: 100%;
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

type State = {
  copied: boolean
};

function recoveryCodeText(recoveryCodes: ?RecoveryCodeList_recoveryCodes): ?string {
  if (recoveryCodes && recoveryCodes.codes) {
    return recoveryCodes.codes.reduce((memo, { code }) => memo.concat(code), []).join('\n');
  }
  return '';
}

let saveFileSupported;
try {
  saveFileSupported = !!new Blob;
} catch (exception) {
  // empty
}

class RecoveryCodeList extends React.PureComponent<Props, State> {
  state = {
    copied: false
  }

  render() {
    return (
      <div className="border border-gray rounded flex items-center justify-center" style={{ minHeight: 330 }}>
        {this.props.isLoading ? (
          <Spinner />
        ) : this.renderCodes()}
      </div>
    );
  }

  renderCodes() {
    return (
      <div className="flex-auto">
        <div className="flex justify-center items-center">
          <List className="list-reset center mx2">
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
        </div>

        <div className="flex flex-wrap justify-center border-top border-gray p1">
          <CopyToClipboard
            text={recoveryCodeText(this.props.recoveryCodes)}
            onCopy={this.handleRecoveryCodeCopy}
          >
            <Button
              className="m1"
              outline={true}
              theme="default"
              disabled={this.state.copied}
            >
              {this.state.copied
                ? 'Copied to Clipboard!'
                : 'Copy to Clipboard'}
            </Button>
          </CopyToClipboard>
        </div>
      </div>
    );
  }

  handleRecoveryCodeCopy = (_text, result) => {
    if (!result) {
      alert('We couldnʼt put this on your clipboard for you, please copy it manually!');
    }
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 1000);
  };
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
