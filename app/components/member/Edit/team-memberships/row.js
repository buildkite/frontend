import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { Link } from 'react-router';

import Button from '../../../shared/Button';
import Emojify from '../../../shared/Emojify';
import Panel from '../../../shared/Panel';

import permissions from '../../../../lib/permissions';

import FlashesStore from '../../../../stores/FlashesStore';

import TeamMemberDeleteMutation from '../../../../mutations/TeamMemberDelete';

import TeamPrivacyConstants from '../../../../constants/TeamPrivacyConstants';

class Row extends React.PureComponent {
  static displayName = "Member.Edit.TeamMemberships.Row";

  static propTypes = {
    teamMember: PropTypes.shape({
      id: PropTypes.string.isRequired,
      team: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        slug: PropTypes.string.isRequired,
        privacy: PropTypes.string.isRequired,
        organization: PropTypes.shape({
          slug: PropTypes.string.isRequired
        }).isRequired,
        pipelines: PropTypes.shape({
          count: PropTypes.number.isRequired
        }).isRequired
      }).isRequired,
      permissions: PropTypes.shape({
        teamMemberDelete: PropTypes.shape({
          allowed: PropTypes.bool.isRequired,
          message: PropTypes.string
        })
      })
    }).isRequired,
    isSelf: PropTypes.bool.isRequired
  };

  state = {
    removing: null
  };

  render() {
    return (
      <Panel.Row key={this.props.teamMember.team.id}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            <div className="m0 flex items-center">
              <Link
                to={`/organizations/${this.props.teamMember.team.organization.slug}/teams/${this.props.teamMember.team.slug}`}
                className="blue hover-navy text-decoration-none hover-underline"
              >
                <Emojify text={this.props.teamMember.team.name} />
              </Link>
              {this.renderPrivacyLabel()}
            </div>
            {this.renderDescription()}
          </div>
          <div className="flex flex-none flex-stretch items-center my1">
            {this.renderPipelineCount()}
          </div>
          <Panel.RowActions>
            {this.renderActions()}
          </Panel.RowActions>
        </div>
      </Panel.Row>
    );
  }

  renderPrivacyLabel() {
    if (this.props.teamMember.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <div className="ml1 regular small border border-gray rounded dark-gray p1">Secret</div>
      );
    }
  }

  renderPipelineCount() {
    if (this.props.teamMember.team.pipelines.count !== 0) {
      return (
        <span className="regular mr2">
          {this.props.teamMember.team.pipelines.count} pipeline{this.props.teamMember.team.pipelines.count === 1 ? '' : 's'}
        </span>
      );
    }
  }

  renderDescription() {
    if (this.props.teamMember.team.description) {
      return (
        <div className="regular dark-gray mt1"><Emojify text={this.props.teamMember.team.description} /></div>
      );
    }
  }

  renderActions() {
    return permissions(this.props.teamMember.permissions).check({
        allowed: 'teamMemberDelete',
        render: () => (
          <Button
            loading={this.state.removing && (this.props.isSelf ? 'Leaving…' : 'Removing…')}
            theme={"default"}
            outline={true}
            className="ml3"
            onClick={this.handleRemove}
          >
            {this.props.isSelf ? 'Leave' : 'Remove'}
          </Button>
        )
    });
  }

  handleRemove = (evt) => {
    if (confirm(this.props.isSelf ? 'Leave this team?' : 'Remove this user from the team?')) {
      evt.preventDefault();

      this.performRemove();
    }
  }

  performRemove = () => {
    this.setState({ removing: true });

    const mutation = new TeamMemberDeleteMutation({
      teamMember: this.props.teamMember
    });

    Relay.Store.commitUpdate(mutation, {
      onFailure: (transaction) => {
        // Remove the "removing" spinner
        this.setState({ removing: false });

        // Show the mutation error
        FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
      }
    });
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    teamMember: () => Relay.QL`
      fragment on TeamMember {
        id
        team {
          id
          name
          description
          slug
          privacy
          organization {
            slug
          }
          pipelines {
            count
          }
        }
        permissions {
          teamMemberDelete {
            allowed
            message
          }
        }
        ${TeamMemberDeleteMutation.getFragment('teamMember')}
      }
    `
  }
});

