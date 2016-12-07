import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Spinner from '../../shared/Spinner';
import Chooser from '../../shared/Chooser';
import Media from '../../shared/Media';
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
    let label;
    let nibOffset;

    switch (this.props.teamPipeline.accessLevel) {
      case MANAGE_BUILD_AND_READ:
        label = "Full Access";
        nibOffset = 10;
        break;

      case BUILD_AND_READ:
        label = "Build & Read";
        nibOffset = 3;
        break;

      case READ_ONLY:
        label = "Read Only";
        nibOffset = 13;
        break;
    }

    return (
      <Dropdown width={270} nibOffset={nibOffset}>
        <div style={{ width: 90 }} className="right-align">
          <div className="underline-dotted cursor-pointer inline-block regular">{label}</div>
        </div>

        <Chooser selected={this.props.teamPipeline.accessLevel} onSelect={this.props.onAccessLevelChange}>
          <Chooser.Option value={MANAGE_BUILD_AND_READ} className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon(MANAGE_BUILD_AND_READ)}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Full Access</span>
                <small className="regular dark-gray">Members can edit pipeline settings, view builds and create builds</small>
              </Media.Description>
            </Media>
          </Chooser.Option>

          <Chooser.Option value={BUILD_AND_READ} className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon(BUILD_AND_READ)}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Build &amp; Read</span>
                <small className="regular dark-gray">Members can view builds and create builds</small>
              </Media.Description>
            </Media>
          </Chooser.Option>

          <Chooser.Option value={READ_ONLY} className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon(READ_ONLY)}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Read Only</span>
                <small className="regular dark-gray">Members can only view builds</small>
              </Media.Description>
            </Media>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderIcon(accessLevel) {
    const width = 25;

    if (this.props.saving === accessLevel) {
      return (
        <div style={{ width: width }}>
          <Spinner className="fit absolute" size={16} style={{ marginTop: 3 }} color={false} />
        </div>
      );
    } else if (this.props.teamPipeline.accessLevel === accessLevel) {
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

export default AccessLevel;
