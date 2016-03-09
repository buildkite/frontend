import React from 'react';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import Icon from '../../shared/Icon';

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
      <Panel.Row to={`blah`}>
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

  handlePipelineRemove = (e) => {
    e.preventDefault();
    this.setState({ removing: true });
    this.props.onRemoveClick(this.props.pipeline);
  };
}

export default Row;
