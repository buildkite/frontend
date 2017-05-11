import React from 'react';

import FlashesStore from '../../../stores/FlashesStore';
import PusherStore from '../../../stores/PusherStore';

import Flash from './flash';

const FLASH_CONN_ERROR_ID = 'FLASH_CONN_ERROR';

class Flashes extends React.PureComponent {
  state = {
    flashes: []
  };

  componentWillMount() {
    if (FlashesStore.preloaded) {
      this.setState({ flashes: FlashesStore.preloaded });
    }
  }

  componentDidMount() {
    FlashesStore.on('flash', this.handleStoreChange);
    PusherStore.on('unavailable', this.handleConnectionError);
    PusherStore.on('connected', this.handleConnectionSuccess);
  }

  componentWillUnmount() {
    FlashesStore.off('flash', this.handleStoreChange);
    PusherStore.off('unavailable', this.handleConnectionError);
    PusherStore.off('connected', this.handleConnectionSuccess);
  }

  handleStoreChange = (payload) => {
    this.setState({ flashes: this.state.flashes.concat(payload) });
  };

  // show a flash when there's a push connection issue
  handleConnectionError = () => {
    const connectionFlash = {
      id: FLASH_CONN_ERROR_ID,
      type: FlashesStore.ERROR,
      message: 'Push events have been disconnected. Real-time updates won’t work for now. We’ll try to reconnect soon!'
    };

    // prepend the flash
    this.setState({
      flashes: [connectionFlash].concat(this.state.flashes)
    });
  };

  // hide connection error flash (if it exists!) when reconnected
  handleConnectionSuccess = () => {
    // as the flash is always prepended (and no other flash is),
    // we can slice from the front rather than filter or find index
    if (this.state.flashes.length > 0 && this.state.flashes[0].id === FLASH_CONN_ERROR_ID) {
      this.setState({
        flashes: this.state.flashes.slice(1)
      });
    }
  };

  render() {
    if (this.state.flashes.length > 0) {
      return (
        <div className="container mb4">
          {this.state.flashes.map((flash) => (
            <Flash
              key={flash.id}
              flash={flash}
              onRemoveClick={this.handleFlashRemove}
            />
          ))}
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
}

export default Flashes;
