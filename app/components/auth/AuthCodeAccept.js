import React from 'react';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';

const AUTH_TYPES = {
  'appletv': 'Apple TV App',
  'casio': 'Casio FX-9860 Add-In',
  'mac': 'Mac App',
  'ps4': 'PlayStation® 4 App',
  'saturn': 'Sega Saturn'
};

export default class AuthCodeAccept extends React.Component {
  render() {
    return (
      <DocumentTitle title="Accept Authentication Code">
        <PageWithContainer>
          <h1>Auth Code Accept!</h1>
          Authenticating for {AUTH_TYPES[this.props.params.type] || 'Unrecognised Type'} with code <code>{this.props.params.code}</code>
        </PageWithContainer>
      </DocumentTitle>
    );
  }
}
