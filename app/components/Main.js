import React from 'react';
import Relay from 'react-relay';
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

export default Relay.createContainer(Main, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        id
        slug
        name
        agents {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberCreate {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamAdmin {
            allowed
          }
          teamCreate {
            allowed
          }
        }
      }
    `,
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          name
          avatar {
            url
          }
        }
        organizations(first: 100) {
          edges {
            node {
              id
              name
              slug
            }
          }
        }
        unreadChangelogs: changelogs(read: false) {
          count
        }
        runningBuilds: builds(state: BUILD_STATE_RUNNING) {
          count
        }
        scheduledBuilds: builds(state: BUILD_STATE_SCHEDULED) {
          count
        }
      }
    `
  }
});
