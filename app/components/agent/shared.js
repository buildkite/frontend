// @flow

export function getColourForConnectionState(connectionState: string, prefix: string = '') {
  switch (connectionState) {
    case 'connected':
      return `${prefix}lime`;
    case 'disconnected':
    case 'stopped':
    case 'lost':
    case 'never_connected':
      return `${prefix}gray`;
    case 'stopping':
      return `${prefix}orange`;
  }
}

const CONNECTION_STATE_LABELS = {
  'connected': 'Connected',
  'disconnected': 'Disconnected',
  'stopped': 'Stopped',
  'stopping': 'Stopping…',
  'never_connected': 'Never Connected',
  'lost': 'Lost Connection'
};

export function getLabelForConnectionState(connectionState: string) {
  return CONNECTION_STATE_LABELS[connectionState];
}
