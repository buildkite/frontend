import React from 'react';
import Icon from './Icon';

class Settings extends React.Component {
  render() {
    return (
      <Icon {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default Settings;
