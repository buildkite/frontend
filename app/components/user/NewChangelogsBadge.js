import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import PusherStore from '../../stores/PusherStore';

class NewChangelogsBadge extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    relay: PropTypes.object.isRequired,
    style: PropTypes.object,
    viewer: PropTypes.shape({
      unreadChangelogs: PropTypes.shape({
        count: PropTypes.number
      })
    })
  };

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  handlePusherWebsocketEvent = () => {
    this.props.relay.forceFetch();
  };

  render() {
    if (!this.props.viewer.unreadChangelogs || !this.props.viewer.unreadChangelogs.count) {
      return null;
    }

    return (
      <ReactCSSTransitionGroup
        transitionName="transition-changelog-appear"
        transitionAppear={true}
        transitionAppearTimeout={3000}
        transitionEnterTimeout={5000}
        transitionLeaveTimeout={5000}
      >
        <span
          key="badge"
          className={classNames(this.props.className, "inline-block hover-faded")}
          style={this.props.style}
        >
          <a
            href="/changelog"
            className="btn bg-lime white hover-white focus-white line-height-1"
            style={{
              padding: '3px 4px',
              fontSize: 9,
              borderRadius: 5
            }}
          >
            NEW
          </a>
          <img
            className="pointer-events-none"
            src={require('../../images/new-changelog-badge-bottom-corner.svg')}
            style={{
              width: 12,
              height: 12,
              position: 'absolute',
              left: -3,
              bottom: -2
            }}
          />
        </span>
      </ReactCSSTransitionGroup>
    );
  }
}

export default Relay.createContainer(NewChangelogsBadge, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    viewer: () => Relay.QL`
        fragment on Viewer {
          unreadChangelogs: changelogs(read: false) @include(if: $isMounted) {
            count
          }
        }
      `
  }
});
