import React from 'react';
import PropTypes from 'prop-types';

import Chooser from '../../shared/Chooser';
import Dropdown from '../../shared/Dropdown';

import TeamMemberRoleConstants from '../../../constants/TeamMemberRoleConstants';

export default class MemberRole extends React.PureComponent {
  static displayName = "Team.Pipelines.Role";

  static propTypes = {
    teamMember: PropTypes.shape({
      role: PropTypes.string.isRequired
    }).isRequired,
    onRoleChange: PropTypes.func.isRequired,
    savingNewRole: PropTypes.string
  };

  render() {
    const saving = this.props.savingNewRole;

    return (
      <Dropdown width={270}>
        <div className="underline-dotted cursor-pointer inline-block regular">{this.label(this.props.teamMember.role)}</div>

        <Chooser selected={this.props.teamMember.role} onSelect={this.props.onRoleChange}>
          <Chooser.SelectOption
            value={TeamMemberRoleConstants.MAINTAINER}
            saving={saving === TeamMemberRoleConstants.MAINTAINER}
            selected={this.props.teamMember.role === TeamMemberRoleConstants.MAINTAINER}
            label={this.label(TeamMemberRoleConstants.MAINTAINER)}
            description={<span>Can create and access pipelines.<br />Can add and remove users.</span>}
          />
          <Chooser.SelectOption
            value={TeamMemberRoleConstants.MEMBER}
            saving={saving === TeamMemberRoleConstants.MEMBER}
            selected={this.props.teamMember.role === TeamMemberRoleConstants.MEMBER}
            label={this.label(TeamMemberRoleConstants.MEMBER)}
            description="Can create and access pipelines."
          />
        </Chooser>
      </Dropdown>
    );
  }

  label(value) {
    switch (value) {
      case TeamMemberRoleConstants.MAINTAINER:
        return "Maintainer";
      case TeamMemberRoleConstants.MEMBER:
        return "Member";
    }
  }
}
