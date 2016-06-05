import React from 'react';

import PageWithMenu from '../shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

import RelayBridge from '../../lib/RelayBridge';

class SettingsSection extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <PageWithMenu>
        <SettingsMenu organization={this.props.organization} />
        {this.props.children}
      </PageWithMenu>
    );
  }
}

export default RelayBridge.createContainer(SettingsSection, {
  organization: (props) => `organization/${props.params.organizationSlug}`
});
