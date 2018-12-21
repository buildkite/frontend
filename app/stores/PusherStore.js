// @flow

import EventEmitter from 'eventemitter3';
import Pusher from 'pusher-js';
import Logger from 'app/lib/Logger';

class PusherStore extends EventEmitter {
  pusher: Pusher;

  constructor() {
    super();
  }

  configure(key: string, options: Object) {
    this.pusher = new Pusher(key, options);
    this.pusher.connection.bind(
      'state_change',
      ({ current, ...context }) => {
        Logger.info('[PusherStore]', current, context);

        this.emit(current, context);
      }
    );
  }

  isConfigured() {
    return !!this.pusher;
  }

  listen(channel: string) {
    Logger.info(`[PusherStore] Listening to channel '${channel}'`);

    this.pusher.subscribe(channel).bind_global((event, payload) => {
      Logger.info('[PusherStore]', event, payload);

      this.emit(event, payload);
    });
  }
}

export default new PusherStore();
