import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

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
    const saving = this.props.savingNewRole;
    const selected = this.props.teamMember.admin ? "admin" : "member";

    return (
      <Dropdown width={270}>
        <div className="underline-dotted cursor-pointer inline-block regular">{this.label(selected)}</div>

        <Chooser selected={selected} onSelect={this.props.onRoleChange}>
          <Chooser.SelectOption
            value="admin"
            saving={saving === "admin"}
            selected={selected === "admin"}
            label={this.label("admin")}
            description="Manage members and pipelines with unrestricted access"
          />
          <Chooser.SelectOption
            value="member"
            saving={saving === "member"}
            selected={selected === "member"}
            label={this.label("member")}
            description="Create and access pipelines based on each pipeline’s permissions"
          />
        </Chooser>
      </Dropdown>
    );
  }

  label(value) {
    switch (value) {
      case "admin":
        return "Team Admin";
      case "member":
        return "Member";
    }
  }
}

export default MemberRole;
