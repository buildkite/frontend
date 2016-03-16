import React from 'react';
import classNames from 'classnames';

import Emojify from '../../shared/Emojify';

let COLOR = (Features.NewNav == undefined || Features.NewNav == true) ? "lime" : "blue";

class Team extends React.Component {
  static propTypes = {
    team: React.PropTypes.object,
    selected: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired
  };

  render() {
    let changes = {};
    changes[`border-${COLOR}`] = this.props.selected;

    let classes = classNames("btn border border-gray rounded mr2 regular user-select-none", changes);

    return (
      <div className={classes} onClick={this.handleOnClick}><Emojify text={this.props.team.name} /></div>
    )
  }

  handleOnClick = (e) => {
    e.preventDefault();
    this.props.onClick(this.props.team);
  };
}

export default Team
