import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import Flashes from './layout/Flashes';
import Banners from './layout/Banners';

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
          <Banners />
          {this.props.children}
          <Footer viewer={this.props.viewer} />
        </div>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(Main, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        ${Navigation.getFragment('organization')}
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        ${Navigation.getFragment('viewer')}
        ${Footer.getFragment('viewer')}
      }
    `
  }
});
