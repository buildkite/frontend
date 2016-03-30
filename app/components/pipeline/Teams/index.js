import React from 'react';

import Team from './team';
import RelayBridge from '../../../lib/RelayBridge';

class Teams extends React.Component {
  static propTypes = {
    organization: React.PropTypes.object.isRequired,
    selected: React.PropTypes.array.isRequired,
    onTeamSelect: React.PropTypes.func.isRequired,
    onTeamDeselect: React.PropTypes.func.isRequired
  };

  state = {
    selected: this.props.selected
  };

  render() {
    return (
      <div>
        {
          this.props.organization.teams.edges.map((edge) => {
            return <Team key={edge.node.id} team={edge.node} onClick={this.handleTeamClick} selected={this.state.selected.indexOf(edge.node.uuid) >= 0} />
          })
        }
      </div>
    )
  }

  handleTeamClick = (team) => {
    let selected = this.state.selected;

    let index = this.state.selected.indexOf(team.uuid);
    if(index != -1) {
      selected.splice(index, 1);
      this.props.onTeamDeselect(team);
    } else {
      selected.push(team.uuid);
      this.props.onTeamSelect(team);
    }

    this.setState({ selected: selected });
  };
}

export default RelayBridge.createContainer(Teams, {
  organization: (props) => `organization/${props.params.organization}`
});
