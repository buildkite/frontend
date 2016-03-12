import React from 'react';
import Relay from 'react-relay';

import PageWithMenu from '../shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

import PreloadedDataStore from '../../stores/PreloadedDataStore';

class SettingsSection extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  state = {
    organization: PreloadedDataStore.get(`organization/${this.props.params.organization}`)
  };

  render() {
    return (
      <PageWithMenu>
        <SettingsMenu organization={this.state.organization} />
        {this.props.children}
      </PageWithMenu>
    );
  }
}

export default SettingsSection;
