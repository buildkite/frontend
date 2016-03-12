import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import Flashes from './layout/Flashes';

import PreloadedDataStore from '../stores/PreloadedDataStore';

class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  state = {
    viewer: PreloadedDataStore.get("viewer"),
    organization: PreloadedDataStore.get(`organization/${this.props.params.organization}`),
  };

  render() {
    return (
      <DocumentTitle title={`Buildkite`}>
        <div>
          <Navigation organization={this.state.organization} viewer={this.state.viewer} />
          <Flashes />
          {this.props.children}
          <Footer viewer={this.state.viewer} />
        </div>
      </DocumentTitle>
    );
  }
}

export default Main;
