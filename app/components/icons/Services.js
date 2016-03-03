import React from 'react';
import Icon from './Icon';

class Services extends React.Component {
  render() {
    return (
      <Icon title="Services" {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default Services;
