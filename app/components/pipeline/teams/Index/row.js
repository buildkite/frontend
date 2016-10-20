import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

import Panel from '../../../shared/Panel';
import Emojify from '../../../shared/Emojify';
import Spinner from '../../../shared/Spinner';
import Button from '../../../shared/Button';

import FlashesStore from '../../../../stores/FlashesStore';
import permissions from '../../../../lib/permissions';

import AccessLevel from '../../../team/Pipelines/access-level';

import TeamPipelineUpdateMutation from '../../../../mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from '../../../../mutations/TeamPipelineDelete';

class Row extends React.Component {
  static propTypes = {
    teamPipeline: React.PropTypes.shape({
      team: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        slug: React.PropTypes.string.isRequired,
        description: React.PropTypes.string,
        members: React.PropTypes.shape({
          count: React.PropTypes.number
        }),
        pipelines: React.PropTypes.shape({
          count: React.PropTypes.number
        })
      }).isRequired,
      permissions: React.PropTypes.shape({
        teamPipelineUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        teamPipelineDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    organization: React.PropTypes.shape({
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    savingNewAccessLevel: null,
    removing: null
  };

  render() {
    return (
      <Panel.Row>
        <div className="flex">
          <div className="flex items-center" style={{ width: "20em" }}>
            <div>
              <div className="m0 semi-bold">
                <Link to={`/organizations/${this.props.organization.slug}/teams/${this.props.teamPipeline.team.slug}`} className="blue hover-navy text-decoration-none hover-underline">
                  <Emojify text={this.props.teamPipeline.team.name} />
                </Link>
              </div>

              {this.renderDescription()}
            </div>
          </div>

          {this.renderAssociations()}

          <Panel.RowActions>
            {this.renderActions()}
          </Panel.RowActions>
        </div>
      </Panel.Row>
    );
  }

  renderDescription() {
    if (this.props.teamPipeline.team.description) {
      return (
        <div className="regular dark-gray"><Emojify text={this.props.teamPipeline.team.description} /></div>
      );
    }
  }

  renderAssociations() {
    // Don't show the associations if the record is still being created (since
    // the optimistic response from the mutation won't have this data)
    if (this.isCreating()) {
      return (
        <div className="flex flex-auto" />
      );
    } else {
      return (
        <div className="flex flex-auto items-center">
          <div className="regular dark-gray">{this.props.teamPipeline.team.pipelines.count} Pipelines, {this.props.teamPipeline.team.members.count} Members</div>
        </div>
      );
    }
  }

  renderActions() {
    // Don't render any actions until the record has been created
    if (this.isCreating()) {
      return (
        <Spinner width={18} height={18} color={false}/>
      );
    } else {
      return permissions(this.props.teamPipeline.permissions).collect(
        {
          allowed: "teamPipelineUpdate",
          render: (idx) => (
            <AccessLevel key={idx} teamPipeline={this.props.teamPipeline} onAccessLevelChange={this.handleAccessLevelChange} saving={this.state.savingNewAccessLevel} />
          )
        },
        {
          allowed: "teamPipelineDelete",
          render: (idx) => (
            <Button
              key={idx}
              loading={this.state.removing ? "Removing…" : false}
              theme={"default"}
              outline={true}
              className="ml3"
              onClick={this.handleRemove}
            >Remove</Button>
          )
        }
      );
    }
  }

  // Returns true/false depending on whether or not this team pipeline record
  // is currently being created.
  isCreating() {
    const transactions = this.props.relay.getPendingTransactions(this.props.teamPipeline);

    return transactions ? transactions[0] : false;
  }

  handleAccessLevelChange = (accessLevel) => {
    this.setState({ savingNewAccessLevel: accessLevel });

    const mutation = new TeamPipelineUpdateMutation({
      teamPipeline: this.props.teamPipeline,
      accessLevel: accessLevel
    });

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => {
        // Hide the saving spinner
        this.setState({ savingNewAccessLevel: null });
      },
      onFailure: (transaction) => {
        // Hide the saving spinner
        this.setState({ savingNewAccessLevel: null });

        // Show the mutation error
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
      }
    });
  };

  handleRemove = () => {
    this.setState({ removing: true });

    const mutation = new TeamPipelineDeleteMutation({
      teamPipeline: this.props.teamPipeline
    });

    Relay.Store.commitUpdate(mutation, {
      onFailure: (transaction) => {
        // Remove the "removing" spinner
        this.setState({ removing: false });

        // Show the mutation error
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
      }
    });
  };
}

export default Relay.createContainer(Row, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `,
    teamPipeline: () => Relay.QL`
      fragment on TeamPipeline {
        ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
        ${TeamPipelineUpdateMutation.getFragment('teamPipeline')}
        accessLevel
        team {
          name
          description
          slug
          members {
            count
          }
          pipelines {
            count
          }
        }
        permissions {
          teamPipelineUpdate {
            allowed
          }
          teamPipelineDelete {
            allowed
          }
        }
      }
    `
  }
});
