import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Chooser from '../../shared/Chooser';
import Dropdown from '../../shared/Dropdown';

const MANAGE_BUILD_AND_READ = "PIPELINE_ACCESS_LEVEL_MANAGE_BUILD_AND_READ";
const BUILD_AND_READ = "PIPELINE_ACCESS_LEVEL_BUILD_AND_READ";
const READ_ONLY = "PIPELINE_ACCESS_LEVEL_READ_ONLY";

class AccessLevel extends React.Component {
  static displayName = "Team.Pipelines.AccessLevel";

  static propTypes = {
    teamPipeline: React.PropTypes.shape({
      accessLevel: React.PropTypes.string.isRequired
    }).isRequired,
    onAccessLevelChange: React.PropTypes.func.isRequired,
    saving: React.PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
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
            description="Members can edit pipeline settings, view builds and create builds"
          />
          <Chooser.SelectOption
            value={BUILD_AND_READ}
            saving={saving === BUILD_AND_READ}
            selected={selected === BUILD_AND_READ}
            label={this.label(BUILD_AND_READ)}
            description="Members can view builds and create builds"
          />
          <Chooser.SelectOption
            value={READ_ONLY}
            label={this.label(READ_ONLY)}
            saving={saving === READ_ONLY}
            selected={selected === READ_ONLY}
            description="Members can only view builds"
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

export default AccessLevel;
