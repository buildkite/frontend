import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Chooser from 'app/components/shared/Chooser';
import Emojify from 'app/components/shared/Emojify';

const PipelineChooser = styled(Chooser)`
  margin: -5px;
`;

class PipelineTeams extends React.Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    selected: PropTypes.array.isRequired,
    onTeamSelect: PropTypes.func.isRequired,
    onTeamDeselect: PropTypes.func.isRequired
  };

  state = {
    selected: this.props.selected
  };

  render() {
    return (
      <PipelineChooser selected={this.state.selected} multiple={true} onSelect={this.handleTeamSelect}>
        {
          this.props.organization.teams.edges.map((edge) => {
            return (
              <Chooser.Option
                tag="button"
                key={edge.node.id}
                value={edge.node.id}
                data={{ team: edge.node }}
                className="btn border border-gray rounded m1 regular user-select-none"
                selectedClassName="border-lime"
              >
                <Emojify text={edge.node.name} />
              </Chooser.Option>
            );
          })
        }
      </PipelineChooser>
    );
  }

  handleTeamSelect = (id, data) => {
    const selected = this.state.selected;

    // Toggle its selected state and fire callbacks
    const index = this.state.selected.indexOf(id);
    if (index !== -1) {
      selected.splice(index, 1);
      this.props.onTeamDeselect(data.team);
    } else {
      selected.push(id);
      this.props.onTeamSelect(data.team);
    }

    this.setState({ selected: selected });
  };
}

export default PipelineTeams;
