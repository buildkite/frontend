import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Header from './Header';
import SettingsMenu from './SettingsMenu';

class SettingsSection extends React.PureComponent {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="container">
        <Header pipeline={this.props.pipeline} />
        <div className="clearfix mxn2">
          <div className="md-col md-col-3 px2">
            <SettingsMenu pipeline={this.props.pipeline} />
          </div>
          <div className="md-col md-col-9 px2">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(SettingsSection, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${Header.getFragment('pipeline')}
        ${SettingsMenu.getFragment('pipeline')}
      }
    `
  }
});
