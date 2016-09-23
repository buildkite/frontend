import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import PusherStore from '../../stores/PusherStore';
import CachedStateWrapper from '../../helpers/CachedStateWrapper';

class NewChangelogsBadge extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    viewer: React.PropTypes.shape({
      unreadChangelogs: React.PropTypes.shape({
        count: React.PropTypes.number
      })
    })
  };

  state = {
    unreadChangelogsCount: this.props.viewer.unreadChangelogs ? this.props.viewer.unreadChangelogs.count : 0
  };

  componentWillMount() {
    if (!this.props.viewer.unreadChangelogs) {
      this.setState({
        unreadChangelogsCount: this.getCachedState().unreadChangelogsCount || 0
      });
    }
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  handlePusherWebsocketEvent = (payload) => {
    this.setCachedState({ unreadChangelogsCount: payload.unreadChangelogsCount });
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.viewer.unreadChangelogs) {
      this.setCachedState({ unreadChangelogsCount: nextProps.viewer.unreadChangelogs.count });
    }
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const { unreadChangeLogsCount: lastChangeLogsCount } = this.state;

    const { unreadChangeLogsCount: newChangeLogsCount } = nextState;
    const { unreadChangelogs: newUnreadChangelogs } = nextProps.viewer;

    return (
      (newUnreadChangelogs && newUnreadChangelogs.count !== lastChangeLogsCount)
      || (newChangeLogsCount !== lastChangeLogsCount)
    );
  };

  render() {
    if (this.state.unreadChangelogsCount > 0) {
      return (
        <ReactCSSTransitionGroup transitionName="transition-changelog-appear" transitionAppear={true} transitionAppearTimeout={3000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
          <span key="badge" className={classNames(this.props.className, "inline-block hover-faded")} style={this.props.style}>
            <a href="/changelog" className="btn bg-lime white hover-white focus-white line-height-1" style={{ padding: '3px 4px', fontSize: '9px', borderRadius: 5 }}>NEW</a>
            <img className="pointer-events-none" src={require('../../images/new-changelog-badge-bottom-corner.svg')} style={{ width: 12, height: 12, position: 'absolute', left: -3, bottom: -2 }} />
          </span>
        </ReactCSSTransitionGroup>
      );
    } else {
      return null;
    }
  }
}

export default CachedStateWrapper(NewChangelogsBadge);
