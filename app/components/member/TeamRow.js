import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Emojify from '../shared/Emojify';

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
    const className = classNames(
      'p1 block cursor-pointer rounded border',
      {
        'border-gray': !this.props.checked,
        'border-green': this.props.checked
      }
    );

    return (
      <div className="p1 col-12 md-col-6 lg-col-4">
        <label className={className} style={{ paddingLeft: '1.9em' }}>
          <input
            type="checkbox"
            checked={this.props.checked}
            onChange={this.handleChange}
            className="absolute"
            style={{
              marginLeft: '-1.7em',
              cursor: 'inherit'
            }}
          />
          <Emojify className="inline-block semi-bold truncate" text={this.props.team.name} /><br />
          <p className="m0 p0 dark-gray truncate"><Emojify text={this.props.team.description || " "} /></p>
        </label>
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
