// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import Flashes from './layout/Flashes';

type Props = {
  children: React$Node,
  viewer?: Object,
  organization?: Object
};

class Main extends React.PureComponent<Props> {
  render() {
    return (
      <DocumentTitle title="Buildkite">
        <div className="flex flex-column" style={{ minHeight: '100vh' }}>
          <Navigation
            organization={this.props.organization}
            viewer={this.props.viewer}
          />
          <Flashes />
          <div className="flex-auto">
            {this.props.children}
          </div>
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
