import React from 'react';
import Relay from 'react-relay';

import Navigation from './layout/Navigation';
import Footer from './layout/Footer';

class Main extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    viewer: React.PropTypes.object.isRequired,
    organization: React.PropTypes.object
  };

  render() {
    return (
      <div>
        <Navigation organization={this.props.organization} viewer={this.props.viewer} />
        {this.props.children}
        <Footer viewer={this.props.viewer} />
      </div>
    );
  }
}

export default Relay.createContainer(Main, {
  fragments: {
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
              name
              slug
            }
          }
        }
        runningBuilds: builds(state: BUILD_STATE_RUNNING) {
          count
        }
        scheduledBuilds: builds(state: BUILD_STATE_SCHEDULED) {
          count
        }
        unreadChangelogs: changelogs(read: false) {
          count
        }
      }
    `,
    organization: () => Relay.QL`
      fragment on Organization {
        id
        name
        slug
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
        }
      }
    `
  }
});
