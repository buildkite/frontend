import React from 'react';
import PropTypes from 'prop-types';

import Chooser from '../../shared/Chooser';
import Dropdown from '../../shared/Dropdown';
import Icon from '../../shared/Icon';

import TeamMemberRoleConstants from '../../../constants/TeamMemberRoleConstants';

const PermissionBlock = ({ children }) => (
  <div className="pointer-events-none" style={{ marginTop: 8, marginLeft: -4 }}>
    {children}
  </div>
);

const Permission = ({ icon, children }) => (
  <div className="flex mt1" style={{ lineHeight: 1.4 }}>
    <Icon icon={icon} className="dark-gray flex-none mr1" style={{ marginTop: -3 }} />
    {children}
  </div>
);

const Can = ({ permission }) => (
  <Permission icon="permission-small-tick" title="Tick">Can {permission}.</Permission>
);

const CanNot = ({ permission }) => (
  <Permission icon="permission-small-cross" title="Cross">Can not {permission}.</Permission>
);

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
            description={
              <PermissionBlock>
                <Can permission="add and remove pipelines" />
                <Can permission="add and remove users" />
              </PermissionBlock>
            }
          />
          <Chooser.SelectOption
            value={TeamMemberRoleConstants.MEMBER}
            saving={saving === TeamMemberRoleConstants.MEMBER}
            selected={this.props.teamMember.role === TeamMemberRoleConstants.MEMBER}
            label={this.label(TeamMemberRoleConstants.MEMBER)}
            description={
              <PermissionBlock>
                <Can permission="and and remove pipelines" />
                <CanNot permission="add or remove users" />
              </PermissionBlock>
            }
          />
        </Chooser>
      </Dropdown>
    );
  }

  label(value) {
    switch (value) {
      case TeamMemberRoleConstants.MAINTAINER:
        return "Team Maintainer";
      case TeamMemberRoleConstants.MEMBER:
        return "Team Member";
    }
  }
}
