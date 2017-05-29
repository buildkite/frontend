import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Header from './Header';
import SettingsMenu from './SettingsMenu';

class SettingsSection extends React.Component {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="container">
        <Header pipeline={this.props.pipeline} />
        <div className="clearfix mxn3">
          <div className="md-col md-col-3 px3">
            <SettingsMenu pipeline={this.props.pipeline} />
          </div>
          <div className="md-col md-col-9 px3">
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
