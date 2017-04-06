import React from 'react';
import Relay from 'react-relay';
import { second } from 'metrick/duration';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import Spinner from '../shared/Spinner';
import PageHeader from '../shared/PageHeader';
import SearchField from '../shared/SearchField';

import { formatNumber } from '../../lib/number';
import permissions from '../../lib/permissions';

import Row from './Row';

const PAGE_SIZE = 1;

class TeamIndex extends React.PureComponent {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.object.isRequired,
      teams: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    searchingTeams: false,
    searchingTeamsIsSlow: false,
    loadingMoreTeams: false
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`Teams · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Title>
              Teams
            </PageHeader.Title>
            <PageHeader.Description>
              Teams allow you to create groups of users, and assign fine-grained permissions for who can view builds and create builds or modify pipelines.
            </PageHeader.Description>
            <PageHeader.Menu>{this.renderNewTeamButton()}</PageHeader.Menu>
          </PageHeader>

          <Panel className="mb4">
            <div className="py2 px3">
              <div className="flex flex-auto items-center">
                <SearchField
                  className="flex-auto"
                  placeholder="Search teams…"
                  searching={this.state.searchingTeamsIsSlow}
                  onChange={this.handleTeamSearch}
                />
              </div>
            </div>

            {this.renderTeamSearchInfo()}
            {this.renderTeams()}
            {this.renderTeamFooter()}
          </Panel>
        </div>
      </DocumentTitle>
    );
  }

  renderTeams() {
    if (this.props.organization.teams) {
      return this.props.organization.teams.edges.map((edge) => {
        return (
          <Row key={edge.node.id} team={edge.node} />
        );
      });
    } else {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }
  }

  renderTeamSearchInfo() {
    const { organization: { teams }, relay: { variables: { teamSearch } } } = this.props;

    if (teamSearch && teams) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">
            {formatNumber(teams.count)} matching teams
          </small>
        </div>
      );
    }
  }

  renderTeamFooter() {
    // don't show any footer if we haven't ever loaded
    // any teams, or if there's no next page
    if (!this.props.organization.teams || !this.props.organization.teams.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreTeamsClick}
      >
        Show more teams…
      </Button>
    );

    // show a spinner if we're loading more teams
    if (this.state.loadingMoreTeams) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  renderNewTeamButton() {
    return permissions(this.props.organization.permissions).check(
      {
        allowed: "teamCreate",
        render: () => <PageHeader.Button link={`/organizations/${this.props.organization.slug}/teams/new`} theme="default" outline={true}>Create a Team</PageHeader.Button>
      }
    );
  }

  handleLoadMoreTeamsClick = () => {
    this.setState({ loadingMoreTeams: true });

    let { teamPageSize } = this.props.relay.variables;

    teamPageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { teamPageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loadingMoreTeams: false });
        }
      }
    );
  };

  handleTeamSearch = (search) => {
    this.setState({ searchingTeams: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingTeamsIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      { teamSearch: search },
      (readyState) => {
        if (readyState.done) {
          if (this.teamSearchIsSlowTimeout) {
            clearTimeout(this.teamSearchIsSlowTimeout);
          }
          this.setState({
            searchingTeams: false,
            searchingTeamsIsSlow: false
          });
        }
      }
    );
  };
}

export default Relay.createContainer(TeamIndex, {
  initialVariables: {
    isMounted: false,
    teamPageSize: PAGE_SIZE,
    teamSearch: null
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        permissions {
          teamCreate {
            allowed
          }
        }
        teams(first: $teamPageSize, search: $teamSearch, order: NAME) @include(if: $isMounted) {
          count
          edges {
            node {
              id
              ${Row.getFragment('team')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});
