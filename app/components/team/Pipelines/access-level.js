import React from 'react';

import Icon from '../../shared/Icon';
import Chooser from '../../shared/Chooser';
import Media from '../../shared/Media';
import Dropdown from '../../shared/Dropdown';

class AccessLevel extends React.Component {
  static displayName = "Team.Pipelines.AccessLevel";

  static propTypes = {
    teamPipeline: React.PropTypes.shape({
      accessLevel: React.PropTypes.string.isRequired
    }).isRequired,
    onAccessLevelChange: React.PropTypes.func.isRequired,
    saving: React.PropTypes.string
  };

  render() {
    let label;
    if(this.props.teamPipeline.accessLevel == "MANAGE_BUILD_AND_READ") {
      label = "Manage & Build"
    } else if (this.props.teamPipeline.accessLevel == "BUILD_AND_READ") {
      label = "Build Only"
    } else if (this.props.teamPipeline.accessLevel == "READ_ONLY") {
      label = "Read Only";
    }

    return (
      <Dropdown align="center" width={270}>
        <div className="underline-dotted cursor-pointer inline-block regular">{label}</div>

        <Chooser selected={this.props.teamPipeline.accessLevel} onSelect={this.props.onAccessLevelChange}>
          <Chooser.Option value="MANAGE_BUILD_AND_READ" className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon("MANAGE_BUILD_AND_READ")}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Manage &amp; Build</span>
                <small className="regular dark-gray">Team members can see and trigger builds, as well as editing settings for pipelines in this team.</small>
              </Media.Description>
            </Media>
          </Chooser.Option>

          <Chooser.Option value="BUILD_AND_READ" className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon("BUILD_AND_READ")}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Build Only</span>
                <small className="regular dark-gray">Team members can only see and trigger builds for pipelines in this team. Team admins can still manage pipelines.</small>
              </Media.Description>
            </Media>
          </Chooser.Option>

          <Chooser.Option value="READ_ONLY" className="btn block hover-bg-silver">
            <Media align="top">
              <Media.Image>{this.renderIcon("READ_ONLY")}</Media.Image>
              <Media.Description>
                <span className="semi-bold block">Read Only</span>
                <small className="regular dark-gray">Team members can only see build logs for pipelines in this team. Team admins can still trigger builds and manage pipelines.</small>
              </Media.Description>
            </Media>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderIcon(accessLevel) {
    let width = 25;

    if(this.props.saving == accessLevel) {
      return (
        <div style={{width: width}}>
          <Icon icon="spinner" className="dark-gray animation-spin fit absolute" style={{width: 16, height: 16, marginTop: 3}} />
        </div>
      )
    } else if(this.props.teamPipeline.accessLevel == accessLevel) {
      return (
        <div className="green" style={{fontSize: 16, width: width}}>✔</div>
      )
    } else {
      return (
        <div className="dark-gray" style={{fontSize: 16, width: width}}>✔</div>
      )
    }
  }
}

export default AccessLevel;
