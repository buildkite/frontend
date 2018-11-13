import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import PageWithMenu from 'app/components/shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

class SettingsSection extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
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

export default Relay.createContainer(SettingsSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        ${SettingsMenu.getFragment('organization')}
      }
    `
  }
});
