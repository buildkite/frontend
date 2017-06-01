import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import reffer from 'reffer';

import Dropdown from '../shared/Dropdown';
import Chooser from '../shared/Chooser';
import Emojify from '../shared/Emojify';
import Icon from '../shared/Icon';

class Teams extends React.Component {
  static propTypes = {
    selected: PropTypes.string,
    organization: PropTypes.object.isRequired,
    onTeamChange: PropTypes.func.isRequired
  };

  render() {
    if (this.props.organization.teams.edges.length === 0) {
      return null;
    }

    return (
      <Dropdown className="ml4" width={300} ref={this::reffer('dropdownNode')}>
        <button className="h3 px0 py1 m0 light dark-gray inline-block btn" style={{ fontSize: 16 }}>
          <div className="flex">
            <span className="flex items-center">
              <span className="truncate">
                {this.renderLabel()}
              </span>
            </span>
            <span className="flex items-center">
              <Icon icon="down-triangle" style={{ width: 8, height: 8, marginLeft: '.5em' }} />
            </span>
          </div>
        </button>

        <Chooser selected={null} onSelect={this.handleDropdownSelect}>
          {this.renderOptions()}
          <Chooser.Option value="" className="btn block hover-bg-silver">
            <div>All teams</div>
          </Chooser.Option>
        </Chooser>
      </Dropdown>
    );
  }

  renderLabel() {
    if (this.props.selected) {
      for (const edge of this.props.organization.teams.edges) {
        if (edge.node.slug === this.props.selected) {
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
      (<Chooser.Option key={edge.node.id} value={edge.node.slug} className="btn block hover-bg-silver line-height-3">
        <Emojify className="block" text={edge.node.name} />
        {edge.node.description ? <Emojify className="dark-gray light" text={edge.node.description} /> : null}
      </Chooser.Option>)
    );
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
