// @flow

import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay/compat';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import { stringify } from 'query-string';
import Button from 'app/components/shared/Button';
import Icon from 'app/components/shared/Icon';
import SectionLoader from 'app/components/shared/SectionLoader';
import PageWithContainer from 'app/components/shared/PageWithContainer';
import SearchField from 'app/components/shared/SearchField';
import Pipelines from './Pipelines';
import Teams from './Teams';
import RelayModernPreloader from 'app/lib/RelayModernPreloader';
import Environment from 'app/lib/relay/environment';
import * as constants from './constants';

import type { OrganizationShowQueryResponse } from './__generated__/OrganizationShowQuery.graphql';
type Organization = $NonMaybeType<$ElementType<OrganizationShowQueryResponse, 'organization'>>;

function canCreatePipelineForOrganization(organization: Organization): boolean {
  return (
    organization &&
    organization.permissions &&
    organization.permissions.pipelineCreate &&
    organization.permissions.pipelineCreate.code === "not_member_of_team"
  ) ? false : true;
}

const FilterField = styled(SearchField)`
  flex-basis: 100%;
  order: 3;
  color: gray;

  & > input {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  @media (min-width: 480px) {
    font-size: 16px;
    flex-basis: 200px;
    /*
    NOTE: the large-screen margin-left is ~half right to adjust for
    the position of SearchField's icon
    */
    margin-left: .5em;
    margin-right: 1em;
    margin-top: -.25em;
    order: initial;
  }
`;

FilterField.defaultProps = {
  className: 'light flex-auto'
};

type State = {
  pageSize: number,
  pipelineFilter: ?string,
  teamFilter: ?string
};

type Props = {
  params: {
    organization: string
  },
  location: {
    query: {
      team?: string,
      filter?: string
    }
  }
};

export default class OrganizationShow extends React.Component<Props, State> {
  environment = Environment.get();
  state = {
    pageSize: constants.PIPELINES_INITIAL_PAGE_SIZE,
    teamFilter: this.teamFilter,
    pipelineFilter: this.nameFilter
  };

  static query = graphql`
    query OrganizationShowQuery(
      $organizationSlug: ID!
      $teamSearch: TeamSelector
      $pageSize: Int!
      $pipelineFilter: String
    ) {
      organization(slug: $organizationSlug) {
        ...Teams_organization
        ...Pipelines_organization @arguments(
          teamSearch: $teamSearch
          pageSize: $pageSize
          pipelineFilter: $pipelineFilter
        )
        id
        slug
        name
        permissions {
          pipelineCreate {
            code
            allowed
            message
          }
        }
      }
    }
  `;

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  get organizationSlug(): string {
    return this.props.params.organization;
  }

  get teamFilter(): ?string {
    return this.props.location.query.team || null;
  }

  get nameFilter(): ?string {
    return this.props.location.query.filter || null;
  }

  get queryVariables() {
    return {
      organizationSlug: this.organizationSlug,
      teamSearch: this.state.teamFilter,
      pipelineFilter: this.state.pipelineFilter,
      pageSize: this.state.pageSize
    };
  }

  constructor(props: Props) {
    super(props);

    RelayModernPreloader.preload(
      OrganizationShow.query,
      this.queryVariables,
      this.environment
    );
  }

  render() {
    return (
      <QueryRenderer
        dataFrom="STORE_THEN_NETWORK"
        environment={this.environment}
        query={OrganizationShow.query}
        variables={this.queryVariables}
        render={this.renderQuery()}
      />
    );
  }

  /* eslint-disable react/no-unused-prop-types */
  renderQuery = () => ({ error, props }: { error: ?Error, props: OrganizationShowQueryResponse }) => {
    if (error) {
      return (<div>BONK!</div>);
    }

    if (!props) {
      return (<SectionLoader />);
    }

    if (props && props.organization) {
      const { organization } = props;

      return (
        <DocumentTitle title={`${organization.name}`}>
          <div>
            <PageWithContainer>
              <div className="flex flex-wrap items-start mb2">
                <h1 className="h1 p0 m0 regular line-height-1 inline-block">Pipelines</h1>
                <Teams
                  selected={this.teamFilter}
                  organization={organization}
                  onTeamChange={this.handleTeamChange(organization)}
                />
                <FilterField
                  borderless={true}
                  onChange={this.handleFilterChange(organization)}
                  defaultValue={this.nameFilter}
                  searching={false}
                  placeholder="Filter"
                  autofocus={true}
                />
                {this.renderNewPipelineButton(organization)}
              </div>
              <Pipelines
                organization={props.organization}
                teamFilter={this.teamFilter}
                nameFilter={this.nameFilter}
              />
            </PageWithContainer>
          </div>
        </DocumentTitle>
      );
    }
  }

  renderNewPipelineButton(organization: Organization) {
    // Don't render the "New Pipeline" button if they're not allowed to due to
    // a `not_member_of_team` permsission error.
    if (!canCreatePipelineForOrganization(organization)) {
      return null;
    }

    // Attach the current team to the "New Pipeline" URL
    let newPipelineURL = `/organizations/${organization.slug}/pipelines/new`;
    if (this.teamFilter) {
      newPipelineURL += `?team=${this.teamFilter}`;
    }

    return (
      <Button
        theme="default"
        outline={true}
        className="p0 ml-auto flex circle items-center justify-center"
        style={{ width: 34, height: 34 }}
        href={newPipelineURL}
        title="New Pipeline"
      >
        <Icon icon="plus" title="New Pipeline" />
      </Button>
    );
  }

  handleTeamChange = (organization: Organization) => (team: string) => {
    this.updateRoute(organization, { team });
  };

  handleFilterChange = (organization: Organization) => (filter: string) => {
    this.updateRoute(organization, { filter });
  };

  updateRoute = (organization: Organization, params: {|filter?: string, team?: string|}) => {
    const query = stringify(
      Object
        .entries({ ...this.props.location.query, ...params })
        .reduce((query, [key, value]) => (value ? { ...query, [key]: value } : query), {})
    );

    if (query) {
      this.context.router.push(`/__sneaky__/${organization.slug}?${query}`);
    } else {
      this.context.router.push(`/__sneaky__/${organization.slug}`);
    }
  };
}
