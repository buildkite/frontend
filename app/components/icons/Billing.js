import React from 'react';
import Icon from './Icon';

class Billing extends React.Component {
  render() {
    return (
      <Icon title="Billing" {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default Billing;
