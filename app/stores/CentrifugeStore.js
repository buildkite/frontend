// @flow

import EventEmitter from 'eventemitter3';
import Centrifuge from 'centrifuge';
import Logger from 'app/lib/Logger';

class CentrifugeStore extends EventEmitter {
  centrifuge: Centrifuge;

  constructor() {
    super();
  }

  configure(url: string, token: string) {
    this.centrifuge = new Centrifuge(url);
    this.centrifuge.setToken(token);
    this.centrifuge.on('connect', (context) => {
      Logger.info('[CentrifugeStore] Connect', context);
      this.emit('connect', context);
    });
    this.centrifuge.on('disconnect', (context) => {
      Logger.info('[CentrifugeStore] Disconnect', context);
      this.emit('disconnect', context);
    });
    Logger.info('[CentrifugeStore] Connecting');
    this.centrifuge.connect();
  }

  isConfigured() {
    return !!this.centrifuge;
  }

  listen(channel: string) {
    Logger.info(`[CentrifugeStore] Listening to channel '${channel}'`);
    this.centrifuge.subscribe(channel, function({data: {event, ...payload}}) {
      Logger.info(`[CentrifugeStore] ${event}`, payload);
      this.emit(event, payload);
    }.bind(this));
  }
}

export default new CentrifugeStore();
