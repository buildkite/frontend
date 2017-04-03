import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import UserAvatar from '../../shared/UserAvatar';

export default class User extends React.Component {
  static displayName = "Team.Members.User";

  static propTypes = {
    user: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      email: React.PropTypes.string.isRequired,
      avatar: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    autoCompletorSuggestion: React.PropTypes.object
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    // Toggle the `dark-gray` color on the repository text if this component is
    // in an auto completor and is highlighted.
    const autoCompletorSuggestion = this.context.autoCompletorSuggestion;
    const emailTextClass = classNames(
      "truncate block",
      {
        "dark-gray": !autoCompletorSuggestion || (autoCompletorSuggestion && !autoCompletorSuggestion.selected),
        "white": (autoCompletorSuggestion && autoCompletorSuggestion.selected)
      }
    );

    return (
      <div className="flex">
        <div className="flex-none icon-mr" style={{ width: 39, height: 39 }} >
          <UserAvatar user={this.props.user} className="fit" />
        </div>
        <div className="flex-auto overflow-hidden">
          <strong className="truncate semi-bold block" title={this.props.user.name}>{this.props.user.name}</strong>
          <small className={emailTextClass} title={this.props.user.email}>{this.props.user.email}</small>
        </div>
      </div>
    );
  }
}
