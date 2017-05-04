import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import Button from '../shared/Button';
import TeamForm from './Form';

import TeamCreateMutation from '../../mutations/TeamCreate';
import GraphQLErrors from '../../constants/GraphQLErrors';
import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

class TeamNew extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    }).isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  state = {
    name: '',
    description: '',
    privacy: TeamPrivacyConstants.VISIBLE,
    saving: false,
    errors: null
  };

  render() {
    return (
      <DocumentTitle title={`New Team · ${this.props.organization.name}`}>
        <form onSubmit={this.handleFormSubmit}>
          <PageHeader>
            <PageHeader.Title>Create a Team</PageHeader.Title>
          </PageHeader>

          <Panel>
            <Panel.Section>
              <TeamForm
                onChange={this.handleFormChange}
                errors={this.state.errors}
                name={this.state.name}
                description={this.state.description}
                privacy={this.state.privacy}
              />
            </Panel.Section>

            <Panel.Footer>
              <Button loading={this.state.saving ? "Creating team…" : false} theme="success">Create Team</Button>
            </Panel.Footer>
          </Panel>
        </form>
      </DocumentTitle>
    );
  }

  handleFormChange = (field, value) => {
    const state = {};
    state[field] = value;

    this.setState(state);
  };

  handleFormSubmit = (evt) => {
    evt.preventDefault();

    this.setState({ saving: true });

    const mutation = new TeamCreateMutation({
      organization: this.props.organization,
      name: this.state.name,
      description: this.state.description,
      privacy: this.state.privacy
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: this.handleMutationSuccess,
      onFailure: this.handleMutationError
    });
  };

  handleMutationError = (transaction) => {
    const error = transaction.getError();
    if (error) {
      if (error.source && error.source.type === GraphQLErrors.RECORD_VALIDATION_ERROR) {
        this.setState({ errors: transaction.getError().source.errors });
      } else {
        alert(error);
      }
    }

    this.setState({ saving: false });
  };

  handleMutationSuccess = (response) => {
    // Redirect to the new team
    this.context.router.push(`/organizations/${this.props.organization.slug}/teams/${response.teamCreate.teamEdge.node.slug}`);
  };
}

export default Relay.createContainer(TeamNew, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        ${TeamCreateMutation.getFragment('organization')}
        name
        slug
      }
    `
  }
});
