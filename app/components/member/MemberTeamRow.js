import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

import Emojify from 'app/components/shared/Emojify';

import TeamLabels from 'app/components/team/Labels';

class MemberTeamRow extends React.Component {
  static propTypes = {
    team: PropTypes.shape({
      id: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }).isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="col-12 md-col-6 lg-col-4 py1">
        <label className="block cursor-pointer px1 pb1">
          <div className="flex items-start">
            <div className="pr2" style={{ lineHeight: 1.75 }}>
              <input
                className="checkbox"
                type="checkbox"
                checked={this.props.checked}
                onChange={this.handleChange}
              />
            </div>
            <div className="flex flex-column">
              <div className="flex items-center m0 relative" style={{ lineHeight: 1.75 }}>
                <Emojify text={this.props.team.name} className="semi-bold truncate" />
                <TeamLabels team={this.props.team} />
              </div>
              {this._renderDescription()}
            </div>
          </div>
        </label>
      </div>
    );
  }

  handleChange = () => {
    this.props.onChange(this.props.team);
  };

  _renderDescription() {
    if (!this.props.team.description) {
      return null;
    }

    return (
      <div className="m0 p0 dark-gray h5 regular" style={{ lineHeight: 1.4 }}>
        <Emojify text={this.props.team.description} />
      </div>
    );
  }
}

export default Relay.createContainer(MemberTeamRow, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        uuid
        name
        description
        ${TeamLabels.getFragment('team')}
      }
    `
  }
});
