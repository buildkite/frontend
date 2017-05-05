import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { second } from 'metrick/duration';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Spinner from '../shared/Spinner';
import PageHeader from '../shared/PageHeader';
import SearchField from '../shared/SearchField';
import Dropdown from '../shared/Dropdown';

import { formatNumber } from '../../lib/number';
import permissions from '../../lib/permissions';

import Row from './Row';

import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

const TEAM_PRIVACIES =  [
  { name: 'All Teams', id: null },
  { name: 'Visible', id: TeamPrivacyConstants.VISIBLE },
  { name: 'Secret', id: TeamPrivacyConstants.SECRET }
];

const PAGE_SIZE = 10;

class TeamIndex extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      permissions: PropTypes.object.isRequired,
      teams: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.object.isRequired
          }).isRequired
        ).isRequired,
        pageInfo: PropTypes.shape({
          hasNextPage: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
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
            <PageHeader.Icon>
              <Icon
                icon="teams"
                className="align-middle mr2"
                style={{ width: 40, height: 40 }}
              />
            </PageHeader.Icon>
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

                <div className="flex-none pl3 flex">
                  <Dropdown width={150} ref={(_teamPrivacyDropdown) => this._teamPrivacyDropdown = _teamPrivacyDropdown}>
                    <div className="underline-dotted cursor-pointer inline-block regular dark-gray">{TEAM_PRIVACIES.find((privacy) => privacy.id === this.props.relay.variables.teamPrivacy).name}</div>
                    {this.renderTeamPrivacies()}
                  </Dropdown>
                </div>
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

  renderTeamPrivacies() {
    return TEAM_PRIVACIES.map((role, index) => {
      return (
        <div key={index} className="btn block hover-bg-silver" onClick={() => { this._teamPrivacyDropdown.setShowing(false); this.handleTeamPrivacySelect(role.id); }}>
          <span className="block">{role.name}</span>
        </div>
      );
    });
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

  handleTeamPrivacySelect = (teamPrivacy) => {
    this.handleTeamFilterChange({ teamPrivacy });
  };

  handleTeamSearch = (teamSearch) => {
    this.handleTeamFilterChange({ teamSearch });
  };

  handleTeamFilterChange = (varibles) => {
    this.setState({ searchingTeams: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingTeamsIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      varibles,
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
    teamSearch: null,
    teamPrivacy: null
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
        teams(first: $teamPageSize, search: $teamSearch, privacy: $teamPrivacy, order: NAME) @include(if: $isMounted) {
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
