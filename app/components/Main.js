import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';
import Flashes from './layout/Flashes';

class Main extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    viewer: PropTypes.object.isRequired,
    organization: PropTypes.object
  };

  render() {
    return (
      <DocumentTitle title="Buildkite">
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
