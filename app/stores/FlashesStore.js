import EventEmitter from 'eventemitter3';

class FlashesStore extends EventEmitter {
  constructor() {
    super(...arguments);
    this.ERROR = "error";
    this.SUCCESS = "success";
    this.INFO = "info";
  }

  flash(type, message) {
    // See if the message is actually a GraphQL exception
    if (message.source && message.message) {
      if (message.source.errors[0] && message.source.errors[0].message) {
        if (message.source.type === "unknown_error") {
          message = "Sorry, there’s been an unexpected error and our engineers have been notified";
        } else {
          message = message.source.errors[0].message;
        }
      } else {
        message = "An unknown error occured";
      }
    }

    this.emit("flash", { id: (new Date()).valueOf(), type: type, message: message });
  }
}

export default new FlashesStore();
