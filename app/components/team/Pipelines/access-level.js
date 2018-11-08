import React from 'react';
import PropTypes from 'prop-types';

import Chooser from 'app/components/shared/Chooser';
import Dropdown from 'app/components/shared/Dropdown';
import PermissionSelectOptionDescriptions from 'app/components/shared/PermissionSelectOptionDescriptions';
import PermissionDescription from 'app/components/shared/PermissionDescription';

const MANAGE_BUILD_AND_READ = "MANAGE_BUILD_AND_READ";
const BUILD_AND_READ = "BUILD_AND_READ";
const READ_ONLY = "READ_ONLY";

export default class AccessLevel extends React.PureComponent {
  static displayName = "Team.Pipelines.AccessLevel";

  static propTypes = {
    teamPipeline: PropTypes.shape({
      accessLevel: PropTypes.string.isRequired,
      permissions: PropTypes.shape({
        teamPipelineUpdate: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    onAccessLevelChange: PropTypes.func.isRequired,
    saving: PropTypes.string
  };

  render() {
    if (this.props.teamPipeline.permissions.teamPipelineUpdate.allowed) {
      return this.renderDropdownWithChooser();
    }
    return (
      <span className="dark-gray">{this.label(this.props.teamPipeline.accessLevel)}</span>
    );

  }

  renderDropdownWithChooser() {
    const saving = this.props.saving;
    const selected = this.props.teamPipeline.accessLevel;

    return (
      <Dropdown width={270}>
        <div className="underline-dotted cursor-pointer inline-block regular">{this.label(selected)}</div>

        <Chooser selected={selected} onSelect={this.props.onAccessLevelChange}>
          <Chooser.SelectOption
            value={MANAGE_BUILD_AND_READ}
            saving={saving === MANAGE_BUILD_AND_READ}
            selected={selected === MANAGE_BUILD_AND_READ}
            label={this.label(MANAGE_BUILD_AND_READ)}
            description={
              <PermissionSelectOptionDescriptions>
                <PermissionDescription allowed={true} permission="view and create builds" />
                <PermissionDescription allowed={true} permission="edit pipeline settings" />
              </PermissionSelectOptionDescriptions>
            }
          />
          <Chooser.SelectOption
            value={BUILD_AND_READ}
            saving={saving === BUILD_AND_READ}
            selected={selected === BUILD_AND_READ}
            label={this.label(BUILD_AND_READ)}
            description={
              <PermissionSelectOptionDescriptions>
                <PermissionDescription allowed={true} permission="view and create builds" />
                <PermissionDescription allowed={false} permission="edit pipeline settings" />
              </PermissionSelectOptionDescriptions>
            }
          />
          <Chooser.SelectOption
            value={READ_ONLY}
            label={this.label(READ_ONLY)}
            saving={saving === READ_ONLY}
            selected={selected === READ_ONLY}
            description={
              <PermissionSelectOptionDescriptions>
                <PermissionDescription allowed={true} permission="view builds" />
                <PermissionDescription allowed={false} permission="create builds" />
                <PermissionDescription allowed={false} permission="edit pipeline settings" />
              </PermissionSelectOptionDescriptions>
            }
          />
        </Chooser>
      </Dropdown>
    );
  }

  label(value) {
    switch (value) {
      case MANAGE_BUILD_AND_READ:
        return "Full Access";
      case BUILD_AND_READ:
        return "Build & Read";
      case READ_ONLY:
        return "Read Only";
    }
  }
}
