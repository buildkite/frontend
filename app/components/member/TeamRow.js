import React from 'react';
import Relay from 'react-relay';

import Panel from '../shared/Panel';
import Emojify from '../shared/Emojify';
import Button from '../shared/Button';

class TeamRow extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      description: React.PropTypes.string,
      members: React.PropTypes.shape({
        count: React.PropTypes.number
      }),
      pipelines: React.PropTypes.shape({
        count: React.PropTypes.number
      })
    }).isRequired,
    onRemove: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <Panel.Row>
        <div className="flex">
          <div className="flex items-center" style={{ width: "20em" }}>
            <div>
              <div className="m0 semi-bold">
                <Emojify text={this.props.team.name} />
              </div>

              {this.renderDescription()}
            </div>
          </div>

          {this.renderAssociations()}

          <Panel.RowActions>
            {this.renderActions()}
          </Panel.RowActions>
        </div>
      </Panel.Row>
    );
  }

  renderDescription() {
    if (this.props.team.description) {
      return (
        <div className="regular dark-gray"><Emojify text={this.props.team.description} /></div>
      );
    }
  }

  renderAssociations() {
    const pipelines = this.props.team.pipelines.count;
    const members = this.props.team.members.count;

    return (
      <div className="flex flex-auto items-center">
        <div className="regular dark-gray">
          {`${pipelines} Pipeline${pipelines === 1 ? '' : 's'}, ${members} Member${members === 1 ? '' : 's'}`}
        </div>
      </div>
    );
  }

  renderActions() {
    return (
      <Button
        theme="default"
        outline={true}
        className="ml3"
        onClick={this.handleRemove}
      >
        Remove
      </Button>
    );
  }

  handleRemove = () => {
    this.props.onRemove(this.props.team);
  };
}

export default Relay.createContainer(TeamRow, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        name
        description
        members {
          count
        }
        pipelines {
          count
        }
      }
    `
  }
});
