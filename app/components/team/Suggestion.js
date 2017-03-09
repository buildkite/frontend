import React from 'react';
import classNames from 'classnames';

import Emojify from '../shared/Emojify';

export default class TeamSuggestion extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string
    }).isRequired
  };

  static contextTypes = {
    autoCompletorSuggestion: React.PropTypes.object
  };

  render() {
    // Toggle the `dark-gray` color on the description text if this component is
    // in an auto completor and is highlighted.
    const autoCompletorSuggestion = this.context.autoCompletorSuggestion;
    const descriptionTextClasses = classNames({
      "dark-gray": !autoCompletorSuggestion || (autoCompletorSuggestion && !autoCompletorSuggestion.selected),
      "white": (autoCompletorSuggestion && autoCompletorSuggestion.selected)
    });

    return (
      <div>
        <strong className="semi-bold block"><Emojify text={this.props.team.name} /></strong>
        <small className={descriptionTextClasses}><Emojify text={this.props.team.description} /></small>
      </div>
    );
  }
}
