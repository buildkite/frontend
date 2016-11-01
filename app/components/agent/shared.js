export function getColourForConnectionState(connectionState, prefix='') {
  switch(connectionState) {
    case 'connected':
      return `${prefix}lime`;
    case 'disconnected':
      return `${prefix}black`;
    case 'stopped':
    case 'stopping':
    case 'never_connected':
      return `${prefix}gray`;
    case 'lost':
      return `${prefix}orange`;
  }
};

const CONNECTION_STATE_LABELS = {
  'connected': 'Connected',
  'disconnected': 'Disconnected',
  'stopped': 'Stopped',
  'stopping': 'Stopping…',
  'never_connected': 'Never Connected',
  'lost': 'Lost Connection'
};

export function getLabelForConnectionState(connectionState) {
  return CONNECTION_STATE_LABELS[connectionState];
};
