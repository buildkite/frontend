import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Emojify from '../shared/Emojify';
import FormCheckbox from '../shared/FormCheckbox';

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
      'px1 pt2 m1 col-12 md-col-6 lg-col-4 rounded border',
      {
        'border-gray': !this.props.checked,
        'border-green': this.props.checked
      }
    );

    return (
      <div className={className}>
        <FormCheckbox
          label={<Emojify text={this.props.team.name} />}
          help={<Emojify text={this.props.team.description || " "} />}
          checked={this.props.checked}
          onChange={this.handleChange}
        />
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
