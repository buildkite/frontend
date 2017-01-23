import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Spinner from '../../shared/Spinner';
import Chooser from '../../shared/Chooser';
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

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const label = this.props.teamMember.admin ? "Team Admin" : "Member";
    const role = this.props.teamMember.admin ? "admin" : "member";
    const nib = this.props.teamMember.admin ? 3 : 15;

    return (
      <Dropdown width={270} nibOffset={nib}>
        <div style={{ width: 87 }} className="right-align">
          <div className="underline-dotted cursor-pointer inline-block regular">{label}</div>
        </div>

        <Chooser selected={role} onSelect={this.props.onRoleChange}>
          <Chooser.Option value="admin" className="btn block hover-bg-silver">
            <div className="flex items-top">
              <div className="flex-none">{this.renderIcon(role, "admin")}</div>
              <div>
                <span className="semi-bold block">Team Admin</span>
                <small className="regular dark-gray">Manage members and pipelines with unrestricted access</small>
              </div>
            </div>
          </Chooser.Option>

          <Chooser.Option value="member" className="btn block hover-bg-silver">
            <div className="flex items-top">
              <div className="flex-none">{this.renderIcon(role, "member")}</div>
              <div>
                <span className="semi-bold block">Member</span>
                <small className="regular dark-gray">Create and access pipelines based on each pipeline’s permissions</small>
              </div>
            </div>
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
          <Spinner className="fit absolute" size={16} style={{ marginTop: 3 }} color={false} />
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
