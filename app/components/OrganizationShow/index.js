// @flow

import * as React from 'react';
import { QueryRenderer, createFragmentContainer, graphql } from 'react-relay/compat';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import { stringify } from 'query-string';
import Button from 'app/components/shared/Button';
import Icon from 'app/components/shared/Icon';
import PageWithContainer from 'app/components/shared/PageWithContainer';
import SearchField from 'app/components/shared/SearchField';
import Pipelines from './Pipelines';
import Teams from './Teams';
import type { OrganizationShowQuery } from './__generated__/OrganizationShowQuery.graphql';

import {createEnvironment} from 'app/lib/relay/environment';

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
    margin-left: .5em;
    margin-right: 1em;
    margin-top: -.25em;
    order: initial;
  }
`;
// NOTE: the large-screen margin-left is ~half right
// to adjust for the position of SearchField's icon

FilterField.defaultProps = {
  className: 'light flex-auto'
};

type Props = {
  organization: OrganizationShowQuery,
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

export default class OrganizationShow extends React.Component<Props> {
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
    const environment = createEnvironment();
    const variables = {
      organizationSlug: this.organizationSlug
    };
    // ...Teams_organization
    // ...Pipelines_organization
    const query = graphql`
      query OrganizationShowQuery($organizationSlug: ID!) {
        organization(slug: $organizationSlug) {

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

    return (
      <DocumentTitle
        // title={`${this.props.organization.name}`}
        title="TODO"
      >
        <div>
          <PageWithContainer>
            <div className="flex flex-wrap items-start mb2">
              <h1 className="h1 p0 m0 regular line-height-1 inline-block">Pipelines</h1>

              <QueryRenderer
                environment={environment}
                query={query}
                variables={variables}
                render={({error, props}) => {
                  return <pre><code>{JSON.stringify(props, null, 4)}</code></pre>;
                }}
              />

              {/* <Teams */}
              {/*   selected={this.props.location.query.team} */}
              {/*   organization={this.props.organization} */}
              {/*   onTeamChange={this.handleTeamChange} */}
              {/* /> */}
              {/* {this.renderFilter()} */}
              {/* {this.renderNewPipelineButton()} */}
            </div>
            {/* <Pipelines */}
            {/*   organization={this.props.organization} */}
            {/*   teamFilter={this.teamFilter} */}
            {/*   nameFilter={this.nameFilter} */}
            {/* /> */}
          </PageWithContainer>
        </div>
      </DocumentTitle>
    );
  }

//   renderNewPipelineButton() {
//     const { permissions } = this.props.organization;
//
//     // Don't render the "New Pipeline" button if they're not allowed to due to
//     // a `not_member_of_team` permsission error.
//     if (permissions && permissions.pipelineCreate && permissions.pipelineCreate.code === "not_member_of_team") {
//       return null;
//     }
//
//     // Attach the current team to the "New Pipeline" URL
//     let newPipelineURL = `/organizations/${this.props.organization.slug}/pipelines/new`;
//     if (this.props.location.query.team) {
//       newPipelineURL += `?team=${this.props.location.query.team}`;
//     }
//
//     return (
//       <Button
//         theme="default"
//         outline={true}
//         className="p0 ml-auto flex circle items-center justify-center"
//         style={{ width: 34, height: 34 }}
//         href={newPipelineURL}
//         title="New Pipeline"
//       >
//         <Icon icon="plus" title="New Pipeline" />
//       </Button>
//     );
//   }
//
//   renderFilter() {
//     return (
//       <FilterField
//         borderless={true}
//         onChange={this.handleFilterChange}
//         defaultValue={this.props.location.query.filter}
//         searching={false}
//         placeholder="Filter"
//         autofocus={true}
//       />
//     );
//   }
//
//   handleTeamChange = (team: string) => {
//     this.updateRoute({ team });
//   };
//
//   handleFilterChange = (filter: string) => {
//     this.updateRoute({ filter });
//   };
//
//   updateRoute = (params: {|filter?: string, team?: string|}) => {
//     const query = stringify(
//       Object
//         .entries({ ...this.props.location.query, ...params })
//         .reduce((query, [key, value]) => (value ? { ...query, [key]: value } : query), {})
//     );
//
//     if (query) {
//       this.context.router.push(`/${this.props.organization.slug}?${query}`);
//     } else {
//       this.context.router.push(`/${this.props.organization.slug}`);
//     }
//   };
}
