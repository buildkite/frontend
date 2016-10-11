import React from 'react';

import Spinner from '../../shared/Spinner';
import Chooser from '../../shared/Chooser';
import Media from '../../shared/Media';
import Dropdown from '../../shared/Dropdown';

class MemberRole extends React.Component {
  static displayName = "Team.Pipelines.Role";

  static propTypes = {
    teamMember: React.PropTypes.shape({
      admin: React.PropTypes.bool.isRequired
    }).isRequired,
    onRoleChange: React.PropTypes.func.isRequired,
    savingNewRole: React.PropTypes.string
  };

  render() {
    const label = this.props.teamMember.admin ? "Team Admin" : "Member";
    const role = this.props.teamMember.admin ? "admin" : "member";
    const nib = this.props.teamMember.admin ? 3 : 15;

    return (
      <Dropdown align="center" width={270} nibOffset={nib}>
        <div style={{ width: 87 }} className="right-align">
          <div className="underline-dotted cursor-pointer inline-block regular">{label}</div>
        </div>

        <Chooser selected={role} onSelect={this.props.onRoleChange}>
          <Chooser.Option value="admin" className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon(role, "admin")}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Team Admin</span>
                <small className="regular dark-gray">Manage members and pipelines with unrestricted access</small>
              </Media.Description>
            </Media>
          </Chooser.Option>

          <Chooser.Option value="member" className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon(role, "member")}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Member</span>
                <small className="regular dark-gray">Create and access pipelines based on each pipeline’s permissions</small>
              </Media.Description>
            </Media>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderIcon(currentRole, roleOption) {
    const width = 25;

    if (this.props.savingNewRole === roleOption) {
      return (
        <div style={{ width: width }}>
          <Spinner className="fit absolute" width={16} height={16} style={{ marginTop: 3 }} color={false} />
        </div>
      );
    } else if (currentRole === roleOption) {
      return (
        <div className="green" style={{ fontSize: 16, width: width }}>✔</div>
      );
    } else {
      return (
        <div className="gray" style={{ fontSize: 16, width: width }}>✔</div>
      );
    }
  }
}

export default MemberRole;
