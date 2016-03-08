import React from 'react';

import Panel from '../../shared/Panel';

import Pipeline from './pipeline';

class Row extends React.Component {
  static displayName = "Team.Pipelines.Row";

  state = {
    removing: false
  }

  render() {
    return (
      <div>
	<Pipeline pipeline={this.props.pipeline.pipeline} />
	{this.renderActions()}
      </div>
    );
  }

  renderActions() {
    var transactions = this.props.relay.getPendingTransactions(this.props.pipeline);
    var transaction = transactions ? transactions[0] : null;

    if(transaction && transaction.getStatus() == "COMMITTING") {
      return (
	<div>Spinner</div>
      );
    } else {
      return (
	<div style={{marginTop: "3px"}}>
	  <Button loading={this.state.removing ? "Removing…" : false}
	    onClick={this.handlePipelineRemove}>Remove</Button>
	</div>
      );
    }
  }

  handlePipelineRemove = (e) => {
    e.preventDefault();
    this.setState({ removing: true });
    this.props.onRemoveClick(this.props.pipeline);
  };
}
