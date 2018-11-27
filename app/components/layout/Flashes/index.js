// @flow

import React from 'react';

import FlashesStore, { type FlashItem } from 'app/stores/FlashesStore';
import PusherStore from 'app/stores/PusherStore';

import Flash from './flash';

const FLASH_CONN_ERROR_ID = 'FLASH_CONN_ERROR';

type State = {
  flashes: Array<FlashItem>,
  lastConnected: boolean
};

class Flashes extends React.PureComponent<{}, State> {
  state = {
    flashes: [],
    lastConnected: true // assume we were connected when the page loaded
  };

  UNSAFE_componentWillMount() {
    if (FlashesStore.preloaded) {
      this.setState({ flashes: FlashesStore.preloaded });
    }
  }

  componentDidMount() {
    FlashesStore.on('flash', this.handleStoreChange);
    FlashesStore.on('reset', this.handleStoreReset);
    PusherStore.on('unavailable', this.handleConnectionError);
    PusherStore.on('connected', this.handleConnectionSuccess);
  }

  componentWillUnmount() {
    FlashesStore.off('flash', this.handleStoreChange);
    FlashesStore.off('reset', this.handleStoreReset);
    PusherStore.off('unavailable', this.handleConnectionError);
    PusherStore.off('connected', this.handleConnectionSuccess);
  }

  handleStoreChange = (payload: FlashItem) => {
    this.setState({ flashes: this.state.flashes.concat(payload) });
  };

  hasConnectionErrorFlash() {
    return this.state.flashes.length > 0 && this.state.flashes[0].id === FLASH_CONN_ERROR_ID;
  }

  handleStoreReset = () => {
    this.setState({
      flashes: (
        this.hasConnectionErrorFlash()
          ? this.state.flashes.slice(0, 1)
          : []
      )
    });
  };

  // show a flash when there's a push connection issue
  //
  // NOTE: Pusher only sends this event if the following conditions are met;
  //        1. The websocket timed out (30 seconds by default)
  //        2. Reconnecting the websocket (after 10 seconds) failed
  //       Thus, this can only happen once in a given 40 second period.
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
    const newState: { flashes?: Array<FlashItem>, lastConnected: boolean } = {
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
    }

    return null;
  }

  handleFlashRemove = (flash: FlashItem) => {
    this.setState({
      flashes: this.state.flashes.filter(
        (nextFlash) => flash.id !== nextFlash.id
      )
    });
  };
}

export default Flashes;
