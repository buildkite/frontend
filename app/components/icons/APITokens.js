import React from 'react';
import Icon from './Icon';

class APITokens extends React.Component {
  render() {
    return (
      <Icon title="API Tokens" {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default APITokens;
