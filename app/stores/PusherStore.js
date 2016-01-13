import EventEmitter from 'eventemitter3';
import Pusher from 'pusher-js';
import Logger from './../lib/Logger';

class PusherStore extends EventEmitter {
  configure(key, channel, options) {
    let pusher = new Pusher(key, options);

    if(channel) {
      pusher.subscribe(channel).bind_all((event, payload) => {
        Logger.info("[PusherStore]", event, payload);

        this.emit(event, payload);
      });
    }
  }
}

export default new PusherStore()
