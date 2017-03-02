import React from 'react';
import Relay from 'react-relay';

import Header from './Header';
import PageWithMenu from '../shared/PageWithMenu';
import SettingsMenu from './SettingsMenu';

class SettingsSection extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired
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
