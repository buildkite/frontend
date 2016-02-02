import EventEmitter from 'eventemitter3';
import Pusher from 'pusher-js';
import Logger from './../lib/Logger';

class PusherStore extends EventEmitter {
  configure(key, channels, options) {
    let pusher = new Pusher(key, options);

    channels.forEach((channel) => {
      pusher.subscribe(channel).bind_all((event, payload) => {
        Logger.info("[PusherStore]", event, payload);

        this.emit(event, payload);
      });
    });
  }
}

export default new PusherStore()
