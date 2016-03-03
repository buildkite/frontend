import React from 'react';
import Icon from './Icon';

class ConnectedAccounts extends React.Component {
  render() {
    return (
      <Icon title="Connected Accounts" {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default ConnectedAccounts;
