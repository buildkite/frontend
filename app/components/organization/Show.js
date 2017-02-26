import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageWithContainer from '../shared/PageWithContainer';
import Button from '../shared/Button';
import Icon from '../shared/Icon';

import Pipelines from './Pipelines';
import Teams from './Teams';

class OrganizationShow extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,
    team: React.PropTypes.string
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <div>
          <PageWithContainer>
            <div className="flex mb2 items-start">
              <div className="mr-auto flex items-start">
                <h1 className="h1 p0 m0 mr4 regular line-height-1 inline-block">Pipelines</h1>
                {this.renderTeams()}
              </div>

              <Button theme="default" outline={true} className="p0 flex circle items-center justify-center" style={{ width: 34, height: 34 }} href={`/organizations/${this.props.organization.slug}/pipelines/new`} title="New Pipeline">
                <Icon icon="plus" title="New Pipeline"/>
              </Button>
            </div>

            <Pipelines organization={this.props.organization} team={this.props.location.query.team || null} />
          </PageWithContainer>
        </div>
      </DocumentTitle>
    );
  }

  renderTeams() {
    // Only render the teams dropdown once the `isMounted` Relay variable has
    // been executed
    if (this.props.relay.variables.isMounted) {
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
        ${Pipelines.getFragment('organization')}
        id
        slug
        name
      }
    `
  }
});
