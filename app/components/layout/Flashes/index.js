import React from 'react';

import FlashesStore from '../../../stores/FlashesStore';
import PusherStore from '../../../stores/PusherStore';

import Flash from './flash';

const FLASH_CONN_ERROR_ID = 'FLASH_CONN_ERROR';

class Flashes extends React.PureComponent {
  state = {
    flashes: [],
    lastConnected: true // assume we were connected when the page loaded
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

  hasConnectionErrorFlash() {
    return this.state.flashes.length > 0 && this.state.flashes[0].id === FLASH_CONN_ERROR_ID;
  }

  // show a flash when there's a push connection issue
  handleConnectionError = () => {
    if (this.hasConnectionErrorFlash() || !this.state.lastConnected) {
      // try not to be irritating; don't add a new flash when
      // we're showing one, or when we haven't reconnected yet.
      //
      // this means we don't add a new flash if the user
      // dismissed one before a connection was restored
      // (kinder for those with flaky connections! <3)
      return;
    }

    const connectionFlash = {
      id: FLASH_CONN_ERROR_ID,
      type: FlashesStore.ERROR,
      message: <span><span className="semi-bold">Couldn’t connect to Buildkite for push updates.</span> We’ll try to reconnect! Information won’t update automatically for now.</span>
    };

    // prepend the flash
    this.setState({
      flashes: [connectionFlash].concat(this.state.flashes),
      lastConnected: false
    });
  };

  // hide connection error flash (if it exists!) when reconnected
  handleConnectionSuccess = () => {
    const newState = {
      // make it known that we got a good connection!
      lastConnected: true
    };

    // as the flash is always prepended (and no other flash is),
    // we can slice from the front rather than filter or find index
    if (this.hasConnectionErrorFlash()) {
      newState.flashes = this.state.flashes.slice(1);
    }

    this.setState(newState);
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
    this.setState({
      flashes: this.state.flashes.filter(
        (nextFlash) => flash.id !== nextFlash.id
      )
    });
  };
}

export default Flashes;
