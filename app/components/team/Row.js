import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Panel from '../shared/Panel'
import UserAvatar from '../shared/UserAvatar'
import Emojify from '../shared/Emojify';

class Row extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      everyone: React.PropTypes.bool.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      members: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      pipelines: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    let description;
    if(this.props.team.description) {
      description = <div className="regular dark-gray truncate" style={{maxWidth: "80%"}}><Emojify text={this.props.team.description} /></div>
    }

    return (
      <Panel.RowLink key={this.props.team.id} to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}`}>
        <div className="flex items-center">
          <div className="flex-auto">
            <div className="semi-bold"><Emojify text={this.props.team.name} /></div>
            {description}
          </div>
          <div className="flex items-center flex-no-shrink dark-gray regular">
            <div>{this.props.team.pipelines.count} pipelines&nbsp;·&nbsp;</div>
            <div className={classNames("dark-gray regular", { "mr1": this.props.team.members.count > 0 })}>{this.props.team.members.count} members</div>
            {
              this.props.team.members.edges.map((edge, index) => {
                return (
                  <UserAvatar
                    key={edge.node.id}
                    user={edge.node.user}
                    className="border border-white"
                    style={{width: 20, height: 20, marginRight: (index == this.props.team.members.edges.length - 1) ? 0 : -4, zIndex: this.props.team.members.edges.length - index, position: "relative"}} />
                  )
              })
            }
          </div>
        </div>
      </Panel.RowLink>
    );
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        name
        description
        everyone
        slug
        organization {
          slug
        }
        members(first: 3) {
          count
          edges {
            node {
              id
              user {
                name
                avatar {
                  url
                }
              }
            }
          }
        },
        pipelines {
          count
        }
      }
    `
  }
});
