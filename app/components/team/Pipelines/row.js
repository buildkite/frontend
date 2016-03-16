import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';

import FlashesStore from '../../../stores/FlashesStore';

import Pipeline from './pipeline';

class Row extends React.Component {
  static displayName = "Team.Pipelines.Row";

  static propTypes = {
    pipeline: React.PropTypes.shape({
      pipeline: React.PropTypes.object.isRequired
    }).isRequired,
    onRemoveClick: React.PropTypes.func.isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    removing: false
  }

  render() {
    return (
      <Panel.Row>
	<Pipeline pipeline={this.props.pipeline.pipeline} />
        <Panel.RowActions>
          {this.renderActions()}
        </Panel.RowActions>
      </Panel.Row>
    );
  }

  renderActions() {
    var transactions = this.props.relay.getPendingTransactions(this.props.pipeline);
    var transaction = transactions ? transactions[0] : null;

    if(transaction && transaction.getStatus() == "COMMITTING") {
      return (
        <Icon icon="spinner" className="dark-gray animation-spin" style={{width: 18, height: 18}} />
      );
    } else {
      return (
        <Button loading={this.state.removing ? "Removing…" : false} theme={"default"} outline={true}
          onClick={this.handlePipelineRemove}>Remove</Button>
      );
    }
  }

  performPipelineRemove = (force) => {
    this.setState({ removing: true });

    this.props.onRemoveClick(this.props.pipeline, force, (error) => {
      this.setState({ removing: false });

      if(error) {
        if(!force && error.source && error.source.type == "must_force_error") {
          if (confirm(error.source.errors[0].message + "\n\nAre you sure you want to remove this pipeline from this team?")) {
            this.performPipelineRemove(true);
          }
        } else {
          FlashesStore.flash(FlashesStore.ERROR, error);
        }
      }
    });
  };

  handlePipelineRemove = (e) => {
    if(confirm("Remove the pipeline from this team?")) {
      e.preventDefault();

      this.performPipelineRemove(false);
    }
  };
}

export default Row;
