import React from 'react';

import FlashesStore from '../../../stores/FlashesStore';

import Flash from './flash';

class Flashes extends React.Component {
  state = {
    flashes: []
  };

  componentDidMount() {
    FlashesStore.on("flash", this.handleStoreChange);
  }

  componentWillUnmount() {
    FlashesStore.off("flash", this.handleStoreChange);
  }

  render() {
    if (this.state.flashes.length > 0) {
      return (
        <div className="container mb4">
          {this.state.flashes.map((flash) => <Flash key={flash.id} flash={flash} onRemoveClick={this.handleFlashRemove} />)}
        </div>
      );
    } else {
      return null;
    }
  }

  handleFlashRemove = (flash) => {
    const flashes = [];

    for (const nextFlash of this.state.flashes) {
      if (flash.id !== nextFlash.id) {
        flashes.push(nextFlash);
      }
    }

    this.setState({ flashes: flashes });
  };

  handleStoreChange = (payload) => {
    this.setState({ flashes: this.state.flashes.concat(payload) });
  };
}

export default Flashes;
