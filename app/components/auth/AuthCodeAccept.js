import React from 'react';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';

const AUTH_TYPES = {
  'appletv': 'Buildkite for Apple TV',
  'casio': 'Buildkite for Casio FX-9860',
  'mac': 'Buildkite for Mac',
  'ps4': 'Buildkite for PlayStation® 4',
  'saturn': 'Buildkite for Sega Saturn'
};

export default class AuthCodeAccept extends React.Component {
  state = {
    authorizing: false
  };

  render() {
    var app = AUTH_TYPES[this.props.params.type] || 'this app'
    return (
      <DocumentTitle title={`Authorize ${app}?`}>
        <PageWithContainer>
          <div className="center sm-col-9 md-col-8 mx-auto">
            <h2>
              <img src={require('../layout/Navigation/logo.svg')} alt="" className="mb2" style={{ height: '1.8em' }} />
              <br />
              Authorize {app}?
            </h2>
            <p className="black">Authorizing {app} will create a new API access token with permission to read your latest builds. You can revoke this at any time in your Personal Settings.</p>
            <p><code>{this.props.params.code}</code></p>
            {this.state.authorizing
              ? <Spinner />
              : <Button onClick={this.handleAuthorizeButtonClick}>Authorize</Button>
            }
          </div>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  handleAuthorizeButtonClick = () => {
    console.debug('Authorize button clicked!');
    this.setState({ authorizing: true });
  };
}
