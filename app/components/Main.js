import React from 'react';
import DocumentTitle from 'react-document-title';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import Flashes from './layout/Flashes';

import RelayBridge from '../lib/RelayBridge';

class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    viewer: React.PropTypes.object.isRequired,
    organization: React.PropTypes.object
  };

  render() {
    return (
      <DocumentTitle title={`Buildkite`}>
        <div>
          <Navigation organization={this.props.organization} viewer={this.props.viewer} />
          <Flashes />
          {this.props.children}
          <Footer viewer={this.props.viewer} />
        </div>
      </DocumentTitle>
    );
  }
}

export default RelayBridge.createContainer(Main, {
  organization: (props) => `organization/${props.params.organizationSlug}`,
  viewer: () => `viewer`
});
