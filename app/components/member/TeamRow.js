import React from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';

import Emojify from '../shared/Emojify';

const Label = styled.label`
  padding-left: 1.8em;
  border-color: #dddddd;

  input[type=checkbox]:focus + & {
    border-color: #888888;
  }

  input[type=checkbox]:checked + & {
    border-color: #2ECC40;
  }

  input[type=checkbox]:checked:focus + & {
    border-color: #1c7d28;
  }
`;

class TeamRow extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string
    }).isRequired,
    checked: React.PropTypes.bool.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  render() {
    // this ain't great, but we do what we must
    const rowName = `TeamRow-${this.props.team.id}`;

    return (
      <div className="p1 col-12 md-col-6 lg-col-4">
        <input
          id={rowName}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.handleChange}
          className="absolute"
          style={{
            marginTop: '.8em',
            marginLeft: '.8em',
            cursor: 'inherit'
          }}
        />
        <Label htmlFor={rowName} className="p1 block cursor-pointer rounded border">
          <Emojify className="inline-block semi-bold truncate" text={this.props.team.name} /><br />
          <p className="m0 p0 dark-gray truncate"><Emojify text={this.props.team.description || " "} /></p>
        </Label>
      </div>
    );
  }

  handleChange = () => {
    this.props.onChange(this.props.team);
  };
}

export default Relay.createContainer(TeamRow, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        name
        description
      }
    `
  }
});
