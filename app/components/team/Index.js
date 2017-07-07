import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { second } from 'metrick/duration';
import DocumentTitle from 'react-document-title';

import Button from '../shared/Button';
import Dropdown from '../shared/Dropdown';
import Icon from '../shared/Icon';
import PageHeader from '../shared/PageHeader';
import Panel from '../shared/Panel';
import SearchField from '../shared/SearchField';
import ShowMoreFooter from '../shared/ShowMoreFooter';
import Spinner from '../shared/Spinner';

import { formatNumber } from '../../lib/number';
import permissions from '../../lib/permissions';

import Row from './Row';

import TeamPrivacyConstants from '../../constants/TeamPrivacyConstants';

const TEAM_PRIVACIES = [
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
        ).isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    searchingTeams: false,
    searchingTeamsIsSlow: false,
    loadingMoreTeams: false,
    enablingTeams: false
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
            {this.renderMenu()}
          </PageHeader>

          {this.renderContent()}
        </div>
      </DocumentTitle>
    );
  }

  renderContent() {
    if (!Features.organizationHasTeams) {
      return (
        <div>
          <Panel>
            <Panel.Section className="max-width-3">
              <p>Teams allows you to group people, pipelines and permissions together.</p>
              <p>
                <img
                  src="//placekitten.com/800/480"
                  width="400"
                  height="240"
                  alt=""
                  title="This tiny kitten uses Teams - shouldn't you?"
                />
              </p>
              <form
                action={`/organizations/${this.props.organization.slug}/teams/enable`}
                acceptCharset=""
                method="POST"
                ref={(form) => this.form = form}
              >
                <input type="hidden" name="utf8" value="✓" />
                <input type="hidden" name={window._csrf.param} value={window._csrf.token} />

                <Button
                  onClick={this.handleEnableTeamsClick}
                  loading={this.state.enablingTeams ? "Setting up Teams…" : false}
                  theme="success"
                >
                  Start using Teams
                </Button>
              </form>
            </Panel.Section>
          </Panel>

          <Panel className="mt4">
            <Panel.Header>
              Frequently Asked Team Questions
            </Panel.Header>
            <Panel.Section className="max-width-2">
              <h3 className="mt3 h4 bold">How do teams work with SSO?</h3>
              <p>When a user signs in to SSO, the additional user is added to your account, and will be charged immediately, just as if you had invited them to the account.</p>
              <h3 className="mt3 h4 bold">A question about teams?</h3>
              <p>An answer about teams.</p>
              <h3 className="mt3 h4 bold">A question about teams?</h3>
              <p>An answer about teams.</p>
            </Panel.Section>
          </Panel>
        </div>
      );
    }

    return (
      <div>
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
          <ShowMoreFooter
            connection={this.props.organization.teams}
            label="teams"
            loading={this.state.loadingMoreTeams}
            onShowMore={this.handleShowMoreTeams}
          />
        </Panel>

        {this.renderDisableTeamsPanel()}
      </div>
    );
  }

  renderDisableTeamsPanel() {
    if(this.props.organization.allTeams && this.props.organization.allTeams.count == 0 && this.props.organization.permissions.teamCreate.allowed) {
      return (
        <Panel className="mb4">
          <Panel.Section>
            <form
              action={`/organizations/${this.props.organization.slug}/teams/disable`}
              acceptCharset=""
              method="POST"
              ref={(form) => this.form = form}
            >
              <input type="hidden" name="utf8" value="✓" />
              <input type="hidden" name={window._csrf.param} value={window._csrf.token} />

              <Button
                onClick={this.handleEnableTeamsClick}
                loading={this.state.enablingTeams ? "Turning off Teams…" : false}
                theme="default"
                outline={true}
              >
                Stop using Teams
              </Button>
            </form>
          </Panel.Section>
        </Panel>
      )
    }
  }

  handleEnableTeamsClick = () => {
    event.preventDefault();
    this.setState({ enablingTeams: true });
    this.form.submit();
  };

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
    if (!this.props.organization.teams) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }

    if (this.props.organization.teams.edges.length === 0) {
      if (this.props.relay.variables.teamSearch) {
        return null;
      }

      return (
        <Panel.Section className="dark-gray">
          <p>There are no teams in this organization</p>
        </Panel.Section>
      );
    }

    return this.props.organization.teams.edges.map((edge) => {
      return (
        <Row key={edge.node.id} team={edge.node} />
      );
    });
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

  renderMenu() {
    if (!Features.organizationHasTeams) {
      return null;
    }

    return (
      <PageHeader.Menu>
        {permissions(this.props.organization.permissions).check(
          {
            allowed: "teamCreate",
            render: () => (
              <PageHeader.Button
                link={`/organizations/${this.props.organization.slug}/teams/new`}
                theme="default"
                outline={true}
              >
                Create a Team
              </PageHeader.Button>
            )
          }
        )}
      </PageHeader.Menu>
    );

  }

  handleShowMoreTeams = () => {
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
        allTeams: teams @include(if: $isMounted) {
          count
        }
        teams(first: $teamPageSize, search: $teamSearch, privacy: $teamPrivacy, order: NAME) @include(if: $isMounted) {
          ${ShowMoreFooter.getFragment('connection')}
          count
          edges {
            node {
              id
              ${Row.getFragment('team')}
            }
          }
        }
      }
    `
  }
});
