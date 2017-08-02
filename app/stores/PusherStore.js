import EventEmitter from 'eventemitter3';
import Pusher from 'pusher-js';
import Logger from '../lib/Logger';

class PusherStore extends EventEmitter {
  constructor(name = 'PusherStore') {
    super();
    this.name = name;
  }

  configure(key, options) {
    this.pusher = new Pusher(key, options);

    this.pusher.connection.bind(
      'state_change',
      ({ current, ...context }) => {
        Logger.info(`[${this.name}]`, current, context);

        this.emit(current, context);
      }
    );
  }

  isConfigured() {
    return !!this.pusher;
  }

  listen(channel) {
    Logger.info(`[${this.name}] Listening to channel '${channel}'`);

    this.pusher.subscribe(channel).bind_global((event, payload) => {
      Logger.info(`[${this.name}]`, event, payload);

      this.emit(event, payload);
    });
  }
}

export const slanger = new PusherStore('SlangerStore');

export default new PusherStore();
