import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import Pipeline from './pipeline';
import AccessLevel from './access-level';

class Row extends React.Component {
  static displayName = "Team.Pipelines.Row";

  static propTypes = {
    teamPipeline: React.PropTypes.shape({
      accessLevel: React.PropTypes.string,
      pipeline: React.PropTypes.object.isRequired,
      permissions: React.PropTypes.shape({
        teamPipelineDelete: React.PropTypes.shape({
          allowed: React.PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    onAccessLevelChange: React.PropTypes.func.isRequired,
    onRemoveClick: React.PropTypes.func.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    savingNewAccessLevel: null,
    removing: false
  }

  render() {
    return (
      <Panel.Row>
        <Pipeline pipeline={this.props.teamPipeline.pipeline} />
        <Panel.RowActions>
          {this.renderActions()}
        </Panel.RowActions>
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
            <AccessLevel key={idx} teamPipeline={this.props.teamPipeline} onAccessLevelChange={this.handleAccessLevelChange} saving={this.state.savingNewAccessLevel} />
          )
        },
        {
          allowed: "teamPipelineDelete",
          render: (idx) => (
            <Button key={idx} loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true} className="ml3"
              onClick={this.handlePipelineRemove}
            >Remove</Button>
          )
        }
      );
    }
  }

  handleAccessLevelChange = (accessLevel) => {
    this.setState({ savingNewAccessLevel: accessLevel });

    this.props.onAccessLevelChange(this.props.teamPipeline, accessLevel, (error) => {
      this.setState({ savingNewAccessLevel: null });

      if (error) {
        FlashesStore.flash(FlashesStore.ERROR, error);
      }
    });
  };

  handlePipelineRemove = (e) => {
    if (confirm("Remove the pipeline from this team?")) {
      e.preventDefault();

      this.performPipelineRemove(false);
    }
  };

  performPipelineRemove = (force) => {
    this.setState({ removing: true });

    this.props.onRemoveClick(this.props.teamPipeline, force, (error) => {
      this.setState({ removing: false });

      if (error) {
        if (!force && error.source && error.source.type === "must_force_error") {
          if (confirm(error.source.errors[0].message + "\n\nAre you sure you want to remove this pipeline from this team?")) {
            this.performPipelineRemove(true);
          }
        } else {
          FlashesStore.flash(FlashesStore.ERROR, error);
        }
      }
    });
  };
}

export default Row;
