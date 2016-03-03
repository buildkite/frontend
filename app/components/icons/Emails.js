import React from 'react';
import Icon from './Icon';

class Emails extends React.Component {
  render() {
    return (
      <Icon title="Emails" {...this.props}>
        <Icon.Placeholder/>
      </Icon>
    );
  }
}

export default Emails;
