import React from 'react';
import Relay from 'react-relay';

import Panel from '../../../shared/Panel';
import Emojify from '../../../shared/Emojify';
import Spinner from '../../../shared/Spinner';
import Button from '../../../shared/Button';
import permissions from '../../../../lib/permissions';

import TeamPipelineUpdateMutation from '../../../../mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from '../../../../mutations/TeamPipelineDelete';

class Row extends React.Component {
  static propTypes = {
    teamPipeline: React.PropTypes.shape({
      team: React.PropTypes.shape({
        name: React.PropTypes.string.isRequired
      }).isRequired,
      permissions: React.PropTypes.shape({
        teamPipelineUpdate: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired,
        teamPipelineDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      }).isRequired
    }).isRequired
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel.Row>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            {this.props.teamPipeline.team.name}
          </div>
          <div className="flex-auto">
            {this.props.teamPipeline.accessLevel}
          </div>
          <div className="flex-auto">
            {this.renderActions()}
          </div>
        </div>
      </Panel.Row>
    );
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
            <div>access level editor</div>
          )
        },
        {
          allowed: "teamPipelineDelete",
          render: (idx) => (
            <Button key={idx} loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true} className="ml3"
              onClick={this.handleTeamPipelineRemove}
            >Remove</Button>
          )
        }
      );
    }
  }

  handleTeamPipelineRemove = () => {
    Relay.Store.commitUpdate(new TeamPipelineDeleteMutation({
      teamPipeline: this.props.teamPipeline
    }), { onFailure: (transaction) => alert(transaction.getError()) });
  };
}

export default Relay.createContainer(Row, {
  fragments: {
    teamPipeline: () => Relay.QL`
      fragment on TeamPipeline {
        ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
        accessLevel
        team {
          name
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
