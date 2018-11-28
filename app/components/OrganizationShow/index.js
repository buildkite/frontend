// @flow

import * as React from 'react';
import { QueryRenderer, createFragmentContainer, graphql } from 'react-relay/compat';
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

import type {
  OrganizationShowQueryVariables,
  OrganizationShowQueryResponse
} from './__generated__/OrganizationShowQuery.graphql';
type Organization = $NonMaybeType<$ElementType<OrganizationShowQueryResponse, 'organization'>>;

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
}

type Props = {
  params: {
    organization: string
  },
  location: {
    query: {
      team?: string,
      filter?: string,
    }
  }
};

export default class OrganizationShow extends React.Component<Props, State> {
  state = {
    pageSize: constants.PIPELINES_INITIAL_PAGE_SIZE,
  };

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

  render() {
    const variables = {
      organizationSlug: this.organizationSlug,
      teamSearch: this.teamFilter,
      pipelineFilter: this.nameFilter,
      pageSize: this.state.pageSize,
    };

    const query = graphql`
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

    const environment = Environment.get();

    // console.log('-----------------------------------')
    // console.log(environment)
    // console.log('-----------------------------------')

    RelayModernPreloader.preload(query, variables, environment);

    // console.log(environment)
    // console.log(variables)
    // console.log(query.modern())
    // console.log(query.modern().text)

    return (
      <QueryRenderer
        dataFrom="STORE_THEN_NETWORK"
        environment={environment}
        query={query}
        variables={variables}
        render={({ error, props }: {error: ?Error, props: OrganizationShowQueryResponse}) => (
          !error ? (
            props && props.organization ? (
              <DocumentTitle title={`${props.organization.name}`}>
                <div>
                  <PageWithContainer>
                    <div className="flex flex-wrap items-start mb2">
                      <h1 className="h1 p0 m0 regular line-height-1 inline-block">Pipelines</h1>
                      <Teams
                        selected={this.teamFilter}
                        organization={props.organization}
                        onTeamChange={this.handleTeamChange(props.organization)}
                      />
                      <FilterField
                        borderless={true}
                        onChange={this.handleFilterChange(props.organization)}
                        defaultValue={this.nameFilter}
                        searching={false}
                        placeholder="Filter"
                        autofocus={true}
                      />
                      {this.renderNewPipelineButton(props.organization)}
                    </div>
                    <Pipelines
                      organization={props.organization}
                      teamFilter={this.teamFilter}
                      nameFilter={this.nameFilter}
                    />
                  </PageWithContainer>
                </div>
              </DocumentTitle>
            ) : <SectionLoader />
          ) : (
            <div>
              ERROR
              {JSON.stringify(props, null, 4)}
              {JSON.stringify(error, null, 4)}
            </div>
          )
        )}
      />
    );
  }

  renderNewPipelineButton(organization: Organization) {
    const { permissions } = organization;

    // Don't render the "New Pipeline" button if they're not allowed to due to
    // a `not_member_of_team` permsission error.
    if (permissions && permissions.pipelineCreate && permissions.pipelineCreate.code === "not_member_of_team") {
      return null;
    }

    // Attach the current team to the "New Pipeline" URL
    let newPipelineURL = `/organizations/${organization.slug}/pipelines/new`;
    if (this.props.location.query.team) {
      newPipelineURL += `?team=${this.props.location.query.team}`;
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
