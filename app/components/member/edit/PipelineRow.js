import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Emojify from '../../shared/Emojify';
import Panel from '../../shared/Panel';

class PipelineRow extends React.PureComponent {
  static propTypes = {
    memberPipeline: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }),
      pipeline: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        slug: PropTypes.string.isRequired,
        organization: PropTypes.shape({
          id: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }),
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.Row key={this.props.teamMember.team.id}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <div className="flex-auto">
            <div className="m0 flex items-center">
              <Link to={`/organizations/${this.props.teamMember.team.organization.slug}/users/${this.props.teamMember.team.slug}`} className="blue hover-navy text-decoration-none hover-underline">
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
    if (this.props.teamMember.permissions.teamMemberDelete.allowed) {
      return <Button
        loading={this.state.removing ? "Removing…" : false}
        theme={"default"}
        outline={true}
        className="ml3"
        onClick={this.handleRemove}
      >Remove</Button>
    }
  }

  handleRemove = (e) => {
    if (confirm("Remove this user from the team?")) {
      e.preventDefault();

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

export default Relay.createContainer(TeamMemberRow, {
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


