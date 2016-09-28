import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import SectionLoader from '../shared/SectionLoader';

import Teams from './Teams';
import Pipelines from './Pipelines';

class OrganizationShow extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    // this.props.relay.setVariables({ isMounted: true, team: this.props.location.query.team || null });
    this.props.relay.setVariables({ isMounted: true });
  }

  // componentDidUpdate(prevProps) {
  //   // Get the current state of the team variable from Relay
  //   let currentTeam = this.props.relay.variables.team;

  //   // Also check if there's a team change current happening...
  //   if(this.props.relay.pendingVariables && this.props.relay.pendingVariables.team) {
  //     currentTeam = this.props.relay.pendingVariables.team;
  //   }

  //   // Also get the new team from the URL
  //   let newTeam = this.props.location.query.team || null;

  //   // If the current team is being switched, follow up with an offical team switch
  //   if(newTeam != currentTeam) {
  //     this.props.relay.setVariables({ team: newTeam });
  //   }
  // }

  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <PageWithContainer>
          <div className="flex mb2 items-start">
            <div className="mr-auto flex items-start">
              <h1 className="h1 p0 m0 mr4 regular line-height-1 inline-block">Pipelines</h1>
              {this.renderTeams()}
            </div>
            <Button theme="default" outline={true} className="p0 flex circle items-center justify-center" style={{ width: 34, height: 34 }} href={`organizations/${this.props.organization.slug}/pipelines/new`} title="New Pipeline">
              <Icon icon="plus" title="New Pipeline"/>
            </Button>
          </div>

          {this.renderPipelines()}
        </PageWithContainer>
      </DocumentTitle>
    );
  }

  renderPipelines() {
    if(this.props.relay.variables.isMounted && !this.props.relay.pendingVariables) {
      return (
        <Pipelines organization={this.props.organization} forceGraphDataFetch={this.props.relay.variables.isMounted} />
      );
    } else {
      return (
        <SectionLoader />
      )
    }
  }

  renderTeams() {
    if(this.props.relay.variables.isMounted) {
      return (
        <Teams selected={this.props.location.query.team} organization={this.props.organization} onTeamChange={this.handleTeamChange} />
      );
    }
  }

  handleTeamChange = (slug) => {
    // Prevent ugly URL's that look like "/acme-inc?team="
    if (slug) {
      this.context.router.push(`/${this.props.organization.slug}?team=${slug}`);
    } else {
      this.context.router.push(`/${this.props.organization.slug}`);
    }
  };
}

export default Relay.createContainer(OrganizationShow, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        ${Teams.getFragment('organization').if(variables.isMounted)}
        ${Pipelines.getFragment('organization').if(variables.isMounted)}
        id
        slug
        name
      }
    `
  }
});
