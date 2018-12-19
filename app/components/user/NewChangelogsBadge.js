// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

import CentrifugeStore from 'app/stores/CentrifugeStore';

type Props = {
  className?: string,
  relay: Relay,
  style?: Object,
  viewer?: {
    unreadChangelogs?: {
      count: number
    }
  }
};

class NewChangelogsBadge extends React.PureComponent<Props> {
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
    CentrifugeStore.on("user_stats:change", this.handleWebsocketEvent);
  }

  componentWillUnmount() {
    CentrifugeStore.off("user_stats:change", this.handleWebsocketEvent);
  }

  handleWebsocketEvent = () => {
    this.props.relay.forceFetch();
  };

  render() {
    if (!this.props.viewer || !this.props.viewer.unreadChangelogs || !this.props.viewer.unreadChangelogs.count) {
      return null;
    }

    return (
      <CSSTransition
        classNames="transition-changelog-appear"
        in={true}
        appear={true}
        timeout={{
          enter: 5000,
          exit: 5000
        }}
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
      </CSSTransition>
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
