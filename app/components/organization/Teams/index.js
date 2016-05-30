import React from 'react';
import Relay from 'react-relay';

import Dropdown from '../../shared/Dropdown';
import Chooser from '../../shared/Chooser';
import Emojify from '../../shared/Emojify';

class Teams extends React.Component {
  static propTypes = {
    selected: React.PropTypes.string,
    organization: React.PropTypes.object.isRequired,
    onTeamChange: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <Dropdown align="center" width={270} ref={c => this.dropdownNode = c}>
        <button className="h4 p0 m0 light dark-gray inline-block btn flex" style={{marginTop: 3, fontSize: 16}}>
          <span className="flex items-center xs-hide"><span className="truncate">{this.renderLabel()}</span></span>
          <span className="ml2 flex items-center">&#9662;</span>
        </button>

        <Chooser selected={null} onSelect={this.handleDropdownSelect}>
          {this.renderOptions()}
          <Chooser.Option value={""} className="btn block hover-bg-silver">
            <div>All teams</div>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderLabel() {
    if(this.props.selected) {
      for(let edge of this.props.organization.teams.edges) {
        if(edge.node.slug == this.props.selected) {
          return (
            <Emojify className="block" text={edge.node.name} />
          );
        }
      }
    }

    return "All teams";
  }

  renderOptions() {
    return this.props.organization.teams.edges.map((edge) =>
      <Chooser.Option key={edge.node.id} value={edge.node.slug} className="btn block hover-bg-silver">
        <Emojify className="block" text={edge.node.name} />
        {edge.node.description ? <Emojify className="dark-gray light" text={edge.node.description} /> : null}
      </Chooser.Option>
    )
  }

  handleDropdownSelect = (slug) => {
    this.dropdownNode.setShowing(false);
    this.props.onTeamChange(slug);
  };
}

export default Relay.createContainer(Teams, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        teams(first: 100) {
          edges {
            node {
              id
              name
              slug
              description
            }
          }
        }
      }
    `
  }
});
