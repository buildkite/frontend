import React from 'react';
import Relay from 'react-relay';

import AutocompleteField from '../../shared/AutocompleteField';
import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import permissions from '../../../lib/permissions';

import FlashesStore from '../../../stores/FlashesStore';

import TeamPipelineCreateMutation from '../../../mutations/TeamPipelineCreate';

import Pipeline from './pipeline';

class Chooser extends React.Component {
  static displayName = "Team.Pipelines.Chooser";

  static propTypes = {
    team: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        pipelines: React.PropTypes.shape({
          edges: React.PropTypes.array.isRequired
        })
      }),
      permissions: React.PropTypes.shape({
        teamPipelineCreate: React.PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    loading: false,
    removing: null,
    showingDialog: false
  };

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true,
      teamSelector: `!${this.props.team.slug}`
    });
  }

  render() {
    return permissions(this.props.team.permissions).check(
      {
        allowed: "teamPipelineCreate",
        render: () => (
          <div>
            <Button onClick={this.handleDialogOpen}>Add Pipeline…</Button>
            <Dialog
              isOpen={this.state.showingDialog}
              onRequestClose={this.handleDialogClose}
              width={350}
            >
              <AutocompleteField
                onSearch={this.handlePipelineSearch}
                onSelect={this.handlePipelineSelect}
                items={this.renderAutoCompleteSuggstions(this.props.relay.variables.pipelineAddSearch)}
                placeholder="Add pipeline…"
                ref={(_autoCompletor) => this._autoCompletor = _autoCompletor}
              />
            </Dialog>
          </div>
        )
      }
    );
  }

  renderAutoCompleteSuggstions(pipelineAddSearch) {
    if (!this.props.team.organization.pipelines) {
      return [];
    }

    // Either render the sugggestions, or show a "not found" error
    if (this.props.team.organization.pipelines.edges.length > 0) {
      return this.props.team.organization.pipelines.edges.map(({ node }) => {
        return [<Pipeline key={node.id} pipeline={node} />, node];
      });
    } else if (pipelineAddSearch !== "") {
      return [<AutocompleteField.ErrorMessage key={"error"}>Could not find a pipeline with name <em>{pipelineAddSearch}</em></AutocompleteField.ErrorMessage>];
    } else {
      return [];
    }
  }

  handleDialogOpen = () => {
    this.setState({ showingDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
  };

  handlePipelineSearch = (pipelineAddSearch) => {
    this.props.relay.setVariables({ pipelineAddSearch });
  };

  handlePipelineSelect = (pipeline) => {
    this._autoCompletor.clear();
    this.props.relay.setVariables({ pipelineAddSearch: '' });
    this._autoCompletor.focus();

    Relay.Store.commitUpdate(new TeamPipelineCreateMutation({
      team: this.props.team,
      pipeline: pipeline
    }), { onFailure: this.handleMutationFailure });
  };

  handleMutationFailure = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Chooser, {
  initialVariables: {
    isMounted: false,
    pipelineAddSearch: '',
    teamSelector: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        slug
        ${TeamPipelineCreateMutation.getFragment('team')}

        organization {
          pipelines(search: $pipelineAddSearch, first: 10, order: RELEVANCE, team: $teamSelector) @include (if: $isMounted) {
            edges {
              node {
                id
                name
                repository {
                  url
                }
                ${TeamPipelineCreateMutation.getFragment('pipeline')}
              }
            }
          }
        }

        permissions {
          teamPipelineCreate {
            allowed
          }
        }
      }
    `
  }
});
