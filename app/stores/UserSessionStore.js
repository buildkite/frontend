import EventEmitter from 'eventemitter3';
import 'whatwg-fetch';

const LOCALSTORAGE_PREFIX = 'UserSessionStore:';

const keyWithPrefix = (key = '') => `${LOCALSTORAGE_PREFIX}${key}`;
const keySansPrefix = (prefixedKey) => {
  if (prefixedKey.indexOf(LOCALSTORAGE_PREFIX) !== 0) {
    throw new Error('keySansPrefix called with invalid key');
  }
  return prefixedKey.slice(LOCALSTORAGE_PREFIX.length);
};

const HTTP = (method, url, body) => (
  fetch(
    url,
    {
      method,
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._csrf.token
      },
      body
    }
  )
);

class UserSessionStore extends EventEmitter {
  constructor() {
    super(...arguments);

    // NOTE: Storage events are *only* sent to tabs/windows which did
    // not initiate the change! This tripped me up for half an hour. 🙄
    window.addEventListener('storage', this.handleStorageEvent, false);
  }

  // This takes a "real" storage event, detects if it's one of ours,
  // and if so, emits a message with a consistent façade
  handleStorageEvent = ({ key: prefixedKey, oldValue, newValue }) => {
    if (prefixedKey.indexOf(keyWithPrefix()) === 0) {
      this.emitMessage(keySansPrefix(prefixedKey), oldValue, newValue);
    }
  };

  get(key) {
    return localStorage.getItem(keyWithPrefix(key));
  }

  set(key, value) {
    const prefixedKey = keyWithPrefix(key);

    this.emitMessage(
      key,
      localStorage.getItem(prefixedKey),
      value
    );

    localStorage.setItem(prefixedKey, value);
    HTTP('POST', '/_session/store', JSON.stringify({ [key]: value }));
  }

  remove(key) {
    const prefixedKey = keyWithPrefix(key);

    this.emitMessage(
      key,
      localStorage.getItem(prefixedKey),
      null
    );

    localStorage.removeItem(prefixedKey);
    HTTP('DELETE', '/_session/store', JSON.stringify([key]));
  }

  clear() {
    // clear UserSessionStore-managed localStorage items
    Object.keys(localStorage)
      .filter((key) => key.indexOf(LOCALSTORAGE_PREFIX) === 0)
      .forEach((key) => {
        localStorage.removeItem(key);

        // We need an event per item, as we're mirroring the
        // StorageEvent API and it doesn't handle multi-item
        // events
        this.sendVirtualEvent(
          keySansPrefix(key),
          localStorage.getItem(key),
          null
        );
      });
  }

  emitMessage(key, oldValue, newValue) {
    // We detect if the value has meaningfully changed
    // as sometimes we get multiple events for the same
    // change. This smooths it out.
    if (oldValue === newValue) {
      return;
    }

    // This should be the only place `emit` is called
    // by UserSessionStore!
    this.emit(
      'change',
      {
        key,
        oldValue,
        newValue
      }
    );
  }
}

export default new UserSessionStore();
