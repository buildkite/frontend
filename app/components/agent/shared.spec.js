/* global describe, it, expect */
import { getColourForConnectionState, getLabelForConnectionState } from './shared';

const CONNECTION_STATES = [
  'connected',
  'disconnected',
  'stopped',
  'stopping',
  'never_connected',
  'lost'
];

describe('getColourForConnectionState', () => {
  CONNECTION_STATES.forEach((connectionState) => {
    describe(`for connection state \`${connectionState}\``, () => {
      it('returns the expected colour with no prefix', () => {
        expect(getColourForConnectionState(connectionState)).toMatchSnapshot();
      });

      it('returns the expected colour with a prefix', () => {
        expect(getColourForConnectionState(connectionState, 'bg-')).toMatchSnapshot();
      });
    });
  });
});

describe('getLabelForConnectionState', () => {
  CONNECTION_STATES.forEach((connectionState) => {
    describe(`for connection state \`${connectionState}\``, () => {
      it('returns the expected label', () => {
        expect(getLabelForConnectionState(connectionState)).toMatchSnapshot();
      });
    });
  });
});
