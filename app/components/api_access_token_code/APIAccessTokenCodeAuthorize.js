import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';

import APIAccessTokenCodeAuthorizeMutation from '../../mutations/APIAccessTokenCodeAuthorize';

import FlashesStore from '../../stores/FlashesStore';

class APIAccessTokenCodeAuthorize extends React.Component {
  static propTypes = {
    apiAccessTokenCode: PropTypes.shape({
      authorizedAt: PropTypes.string,
      application: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired
    })
  };

  state = {
    authorizing: false
  };

  render() {
    const title = this.props.apiAccessTokenCode ? `Authorize ${this.props.apiAccessTokenCode.application.name}?` : "Code not found";

    return (
      <DocumentTitle title={title}>
        <PageWithContainer>
          <div className="center sm-col-9 md-col-5 mx-auto py4">
            {this.props.apiAccessTokenCode ? this.renderAPIAccessTokenCode() : this.renderMissing()}
          </div>
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderMissing() {
    return (
      <div className="py4">
        <p>Sorry, we couldn’t find that code. It may have expired!</p>
      </div>
    );
  }

  renderAPIAccessTokenCode() {
    return (
      <div className="py4">
        <h2>
          <img src={require('../layout/Navigation/logo.svg')} alt="" className="mb2" style={{ height: '1.8em' }} />
          <br />
          Authorize {this.props.apiAccessTokenCode.application.name}?
        </h2>
        <p className="black">Authorizing {this.props.apiAccessTokenCode.application.name} will create a new API access token with permission to do anything. You can revoke this at any time in your Personal Settings.</p>
        {this.renderAction()}
      </div>
    );
  }

  renderAction() {
    if (this.props.apiAccessTokenCode.authorizedAt) {
      return (
        <p>Authorized!!</p>
      );
    } else if (this.state.authorizing) {
      return (
        <Spinner />
      );
    }

    return (
      <Button onClick={this.handleAuthorizeButtonClick}>Authorize</Button>
    );
  }

  handleAuthorizeButtonClick = () => {
    this.setState({ authorizing: true });

    const mutation = new APIAccessTokenCodeAuthorizeMutation({
      apiAccessTokenCode: this.props.apiAccessTokenCode,
      graceful: false
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationSuccess = () => {
    this.setState({ authorizing: false });
  };

  handleMutationError = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());

    this.setState({ authorizing: false });
  };
}

export default Relay.createContainer(APIAccessTokenCodeAuthorize, {
  fragments: {
    apiAccessTokenCode: () => Relay.QL`
      fragment on APIAccessTokenCode {
        ${APIAccessTokenCodeAuthorizeMutation.getFragment('apiAccessTokenCode')}
        authorizedAt
        application {
          name
        }
      }
    `
  }
});
