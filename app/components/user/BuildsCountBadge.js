import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shallowCompare from 'react-addons-shallow-compare';

import PusherStore from '../../stores/PusherStore';
import Badge from '../shared/Badge';
import CachedStateWrapper from '../../lib/CachedStateWrapper';

class BuildsCountBadge extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      scheduledBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }),
      runningBuilds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    }),
    className: React.PropTypes.string
  };

  state = {
    scheduledBuildsCount: this.props.viewer.scheduledBuilds ? this.props.viewer.scheduledBuilds.count : 0,
    runningBuildsCount: this.props.viewer.runningBuilds ? this.props.viewer.runningBuilds.count : 0
  };

  componentWillMount() {
    const initialState = {};
    const cachedState = this.getCachedState();

    if (!this.props.viewer.scheduledBuilds) {
      initialState.scheduledBuildsCount = cachedState.scheduledBuildsCount || 0;
    }

    if (!this.props.viewer.runningBuilds) {
      initialState.runningBuildsCount = cachedState.runningBuildsCount || 0;
    }

    if (Object.keys(initialState).length) {
      this.setState(initialState);
    }
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  handlePusherWebsocketEvent = (payload) => {
    this.setCachedState({
      scheduledBuildsCount: payload.scheduledBuildsCount,
      runningBuildsCount: payload.runningBuildsCount
    });
  };

  componentWillReceiveProps = (nextProps) => {
    // if the next `viewer` instance is the same as our old one, any statistics
    // attached are *probably* outdated and our previous state is more trustworthy
    if (nextProps.viewer === this.props.viewer) {
      return;
    }

    if (nextProps.viewer.scheduledBuilds || nextProps.viewer.runningBuilds) {
      this.setCachedState({
        scheduledBuildsCount: nextProps.viewer.scheduledBuilds.count,
        runningBuildsCount: nextProps.viewer.runningBuilds.count
      });
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return shallowCompare(this, nextProps, nextState);
  };

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="transition-appear-pop" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
        {this.renderBadge()}
      </ReactCSSTransitionGroup>
    );
  }

  renderBadge() {
    const count = this.state.runningBuildsCount + this.state.scheduledBuildsCount;

    if (count > 0) {
      return (
        <Badge key="badge" className={this.props.className}>{count}</Badge>
      );
    }
  }
}

export default CachedStateWrapper(BuildsCountBadge, { validLength: 60 * 60 * 1000 /* 1 hour */ });
