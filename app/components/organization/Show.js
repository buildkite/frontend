// @flow

import * as React from 'react';
import { QueryRenderer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import { stringify } from 'query-string';
import Button from 'app/components/shared/Button';
import Icon from 'app/components/shared/Icon';
import PageWithContainer from 'app/components/shared/PageWithContainer';
import SearchField from 'app/components/shared/SearchField';
import environment from 'app/lib/relay/environment';
import Pipelines from './Pipelines';
import Teams from './Teams';
import type { Show_organization } from './__generated__/Show_organization.graphql';

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
  organization: Show_organization,
  location: {
    query: Object
  }
};

export default class OrganizationShow extends React.Component<Props> {
  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  get slug(): string {
    return this.props.params.organization;
  }

  get teamFilter(): ?string {
    return this.props.location.query.team || null;
  }

  get nameFilter(): ?string {
    return this.props.location.query.filter || null;
  }

  render() {
    return (
      <DocumentTitle
        title="TODO"
        //title={`${this.props.organization.name}`}
      >
        <div>
          <PageWithContainer>
            <QueryRenderer
              environment={environment}
              query={graphql`
                query ShowQuery($organization: ID!) {
                  organization(slug: $organization) {
                    ...Teams_organization
                    ...Pipelines_organization

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
              `}
              variables={{
                organization: this.slug
              }}
              render={({error, props}) => {
                if (error) {
                  return <div>{error.message}</div>;
                } else if (props) {
                  return (
                    <div>
                      <div className="flex flex-wrap items-start mb2">
                        <h1 className="h1 p0 m0 regular line-height-1 inline-block">Pipelines</h1>
                        <Teams
                          selected={this.props.location.query.team}
                          organization={props.organization}
                          onTeamChange={this.handleTeamChange}
                        />
                        {this.renderFilter()}
                        {this.renderNewPipelineButton(props)}
                      </div>
                      <Pipelines
                        organization={props.organization}
                        teamFilter={this.teamFilter}
                        nameFilter={this.nameFilter}
                      />
                    </div>
                  );
                }
                return <div>Loading</div>;
              }}
            />
          </PageWithContainer>
        </div>
      </DocumentTitle>
    );
  }

  renderNewPipelineButton(props) {
    const { permissions } = props.organization;

    // Don't render the "New Pipeline" button if they're not allowed to due to
    // a `not_member_of_team` permsission error.
    if (permissions && permissions.pipelineCreate && permissions.pipelineCreate.code === "not_member_of_team") {
      return null;
    }

    // Attach the current team to the "New Pipeline" URL
    let newPipelineURL = `/organizations/${this.slug}/pipelines/new`;
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

  renderFilter() {
    return (
      <FilterField
        borderless={true}
        onChange={this.handleFilterChange}
        defaultValue={this.props.location.query.filter}
        searching={false}
        placeholder="Filter"
        autofocus={true}
      />
    );
  }

  handleTeamChange = (team: string) => {
    this.updateRoute({ team });
  };

  handleFilterChange = (filter: string) => {
    this.updateRoute({ filter });
  };

  updateRoute = (params: {|filter?: string, team?: string|}) => {
    const query = stringify(
      Object
        .entries({ ...this.props.location.query, ...params })
        .reduce((query, [key, value]) => (value ? { ...query, [key]: value } : query), {})
    );

    if (query) {
      this.context.router.push(`/${this.slug}?${query}`);
    } else {
      this.context.router.push(`/${this.slug}`);
    }
  };
}
