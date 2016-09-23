import React from 'react';
import PusherStore from '../../stores/PusherStore';
import Badge from './../shared/Badge';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
    scheduledBuildsCount: this.props.viewer.scheduledBuilds.count,
    runningBuildsCount: this.props.viewer.runningBuilds.count
  };

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

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

  handlePusherWebsocketEvent = (payload) => {
    this.setState({ scheduledBuildsCount: payload.scheduledBuildsCount, runningBuildsCount: payload.runningBuildsCount });
  };
}

export default BuildsCountBadge;
