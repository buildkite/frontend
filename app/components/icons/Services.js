import React from 'react';
import Icon from './Icon';

class Services extends React.Component {
  render() {
    return (
      <Icon {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default Services;
