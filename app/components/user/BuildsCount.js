import React from 'react';
import PusherStore from '../../stores/PusherStore';

class BuildsCount extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.shape({
      builds: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      })
    })
  };

  state = { count: this.props.viewer.builds.count };

  componentDidMount() {
    PusherStore.on("user_stats:change", this._onStoreChange.bind(this));
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this._onStoreChange.bind(this));
  }

  render() {
    return (
      <span>{this.state.count}</span>
    );
  }

  _onStoreChange(payload) {
    this.setState({ count: payload.activeBuildsCount });
  }
}

export default BuildsCount;
