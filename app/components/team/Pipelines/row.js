import React from 'react';
import PropTypes from 'prop-types';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';
import permissions from '../../../lib/permissions';

import AccessLevel from './access-level';

export default class Row extends React.PureComponent {
  static displayName = "Team.Pipelines.Row";

  static propTypes = {
    teamPipeline: PropTypes.shape({
      accessLevel: PropTypes.string,
      pipeline: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        repository: PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      }).isRequired,
      permissions: PropTypes.shape({
        teamPipelineUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired,
        teamPipelineDelete: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    onAccessLevelChange: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    savingNewAccessLevel: null,
    removing: false
  }

  render() {
    const pipeline = this.props.teamPipeline.pipeline;

    return (
      <Panel.Row>
        <div>
          <a
            className="truncate semi-bold blue hover-navy text-decoration-none hover-underline block"
            href={pipeline.url}
            title={pipeline.name}
          >
            <Emojify text={pipeline.name} />
          </a>
          <small
            className="truncate dark-gray block"
            title={pipeline.repository.url}
          >
            {pipeline.repository.url}
          </small>
        </div>
        <Panel.RowActions className="ml2">
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
        <Spinner size={18} color={false} />
      );
    }

    return permissions(this.props.teamPipeline.permissions).collect(
      {
        always: true,
        render: (idx) => (
          <AccessLevel
            key={idx}
            teamPipeline={this.props.teamPipeline}
            onAccessLevelChange={this.handleAccessLevelChange}
            saving={this.state.savingNewAccessLevel}
          />
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
            onClick={this.handlePipelineRemove}
          >
            Remove
          </Button>
        )
      }
    );
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

  handlePipelineRemove = (evt) => {
    if (confirm("Remove the pipeline from this team?")) {
      evt.preventDefault();

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
