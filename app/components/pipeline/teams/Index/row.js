import React from 'react';
import Relay from 'react-relay';

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
        description: React.PropTypes.string.isRequired
      }).isRequired,
      permissions: React.PropTypes.shape({
        teamPipelineUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        teamPipelineDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired
  };

  state = {
    savingNewAccessLevel: null,
    removing: null
  };

  render() {
    return (
      <Panel.Row>
        <div className="flex-auto">
          <div className="m0 semi-bold"><Emojify text={this.props.teamPipeline.team.name} /></div>
          {this.renderDescription()}
        </div>
        <Panel.RowActions>
          {this.renderActions()}
        </Panel.RowActions>
      </Panel.Row>
    );
  }

  renderDescription() {
    if (this.props.teamPipeline.team.description) {
      return (
        <div className="regular dark-gray mt1"><Emojify text={this.props.teamPipeline.team.description} /></div>
      );
    }
  }

  renderActions() {
    const transactions = this.props.relay.getPendingTransactions(this.props.teamPipeline);
    const transaction = transactions ? transactions[0] : null;

    if (transaction) {
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

  handleAccessLevelChange = (accessLevel) => {
    this.setState({ savingNewAccessLevel: accessLevel });

    let mutation = new TeamPipelineUpdateMutation({
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

    let mutation = new TeamPipelineDeleteMutation({
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
    teamPipeline: () => Relay.QL`
      fragment on TeamPipeline {
        ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
        ${TeamPipelineUpdateMutation.getFragment('teamPipeline')}
        accessLevel
        team {
          name
          description
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
