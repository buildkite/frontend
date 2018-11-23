// @flow

import Relay from 'react-relay/classic';
import fromGraphQL from 'react-relay/lib/fromGraphQL';


const QUERIES = {
  "build_header/build": Relay.QL`
    query BuildsShowBuild($build: ID!) {
      build(slug: $build) {
        id
        createdBy {
          __typename
          ...on UnregisteredUser {
            name
            email
            avatar {
              url
            }
          }
          ...on User {
            id
            name
            email
            avatar {
              url
            }
          }
        }
      }
    }
  `,
  "build_header/viewer": Relay.QL`
    query BuildsShowViewer {
      viewer {
        emails(first: 50) {
          edges {
            node {
              id
              address
              verified
            }
          }
        }
      }
    }
  `,
  "organization_show/organization": Relay.QL`
    query PipelinesList($organization: ID!, $team: TeamSelector, $pageSize: Int, $pipelineFilter: String) {
      organization(slug: $organization) {
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
        teams(first: 100) {
          edges {
            node {
              id
              name
              slug
              description
              permissions {
                pipelineView {
                  allowed
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        allPipelines: pipelines(team: $team) {
          count
       }
        pipelines(first: $pageSize, search: $pipelineFilter, team: $team, order: NAME_WITH_FAVORITES_FIRST) {
          edges {
            node {
              id
              name
              slug
              description
              url
              favorite
              defaultBranch
              permissions {
                pipelineFavorite {
                  allowed
                }
              }
              metrics(first: 6) {
                edges {
                  node {
                    label
                    value
                    url
                    id
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
              builds(first: 1, branch: "%default", state: [ RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED ]) {
                edges {
                  node {
                    id
                    message
                    url
                    commit
                    state
                    startedAt
                    finishedAt
                    canceledAt
                    scheduledAt
                    createdBy {
                      __typename
                      ... on User {
                        id
                        name
                        avatar {
                          url
                        }
                      }
                      ...on UnregisteredUser {
                        name
                        avatar {
                          url
                        }
                      }
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  `,
  "navigation/organization": Relay.QL`
    query NavigationOrganization($organization: ID!) {
      organization(slug: $organization) {
        name
        id
        slug
        agents {
          count
        }
        permissions {
          pipelineView {
            allowed
            code
          }
          agentView {
            allowed
          }
          organizationUpdate {
            allowed
          }
          organizationInvitationCreate {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamView {
            allowed
          }
        }
      }
    }
  `,
  "navigation/viewer": Relay.QL`
    query NavigationViewer {
      viewer {
        id
        user {
          name,
          avatar {
            url
          }
          id
        }
      }
    }
  `,
  "settings_navigation/organization": Relay.QL`
    query GetOrganization($organization: ID!) {
      organization(slug: $organization) {
        id
        name
        slug
        invitations(state: PENDING) {
          count
        }
        permissions {
          organizationUpdate {
            allowed
          }
          organizationMemberView {
            allowed
          }
          notificationServiceUpdate {
            allowed
          }
          organizationBillingUpdate {
            allowed
          }
          teamView {
            allowed
          }
          teamEnabledChange {
            allowed
          }
          auditEventsView {
            allowed
          }
        }
      }
    }
  `,
  "agents/index": Relay.QL`
    query AgentIndex($organization: ID!) {
      organization(slug: $organization) {
        id
        permissions {
          agentTokenView {
            allowed
          }
        }
        agentTokens(first:50, revoked:false) {
          edges {
            node {
              id
              description
              public
              token
            }
            cursor
          },
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  `,

  /*
  Disabling graphql/no-deprecated-fields here as I think there is some changes probably
  required in the graph implementation so that we can actually use the alternatives to
  `pingedAt`, `stoppedAt`, & `stoppedBy` fields as at the moment it seems like using these
  fields will mean we need do a lot of extra fetching and checking on the client which
  seems bad?
  */
  /* eslint-disable graphql/no-deprecated-fields */
  "agents/show": Relay.QL`
    query($slug: ID!) {
      agent(slug: $slug) {
        id
        name
        organization {
          id
          name
          slug
        }
        connectedAt
        connectionState
        disconnectedAt
        hostname
        id
        ipAddress
        job {
          __typename
          ... on JobTypeCommand {
            id
            label
            command
            url
            build {
              number
              pipeline {
                name
                id
              }
              id
            }
          }
        }
        lostAt
        metaData
        operatingSystem {
          name
        }
        permissions {
          agentStop {
            allowed
            code
            message
          }
        }
        pid
        pingedAt
        public
        stoppedAt
        stoppedBy {
          name
          id
        }
        userAgent
        uuid
        version
      }
    }
  `,
  /* eslint-enable graphql/no-deprecated-fields */
  "teams/index": Relay.QL`
    query($organization: ID!) {
      organization(slug: $organization) {
        id
        name
        slug
        permissions {
          teamView {
            allowed
            code
            message
          }
          teamEnabledChange {
            allowed
            code
            message
          }
          teamCreate {
            allowed
          }
        }
      }
    }
  `,
  "sso/index": Relay.QL`
    query($organization: ID!) {
      organization(slug: $organization) {
        id
        name
        slug
        permissions {
          organizationUpdate {
            allowed
          }
        }
      }
    }
  `,
  "pipeline/header/build": Relay.QL`
    query($buildSlug: ID!) {
      build(slug: $buildSlug) {
        id
        branch
        commit
      }
    }
  `,
  "pipeline/header": Relay.QL`
    query($pipeline: ID!) {
      pipeline(slug: $pipeline) {
        id
        name
        description
        url
        slug
        defaultBranch
        organization {
          name
          slug
          id
        }
        repository {
          url
          provider {
            __typename
            url
          }
        }
        builds {
          count
        }
        scheduledBuilds: builds(state: SCHEDULED) {
          count
        }
        runningBuilds: builds(state: RUNNING) {
          count
        }
        permissions {
          pipelineUpdate {
            allowed
            code
            message
          }
          buildCreate {
            allowed
            code
            message
          }
        }
      }
    }
  `,
  "pipeline/settings": Relay.QL`
    query($pipeline: ID!) {
      pipeline(slug: $pipeline) {
        id
        name
        slug
        organization {
          slug
          permissions {
            teamView {
              allowed
            }
          }
        }
        repository {
          provider {
            __typename
            name
          }
        }
        teams {
          count
        }
        schedules {
          count
        }
        permissions {
          pipelineUpdate {
            allowed
          }
        }
      }
    }
  `,
  "pipeline/teams_settings": Relay.QL`
    query($pipeline: ID!) {
      pipeline(slug: $pipeline) {
        id
        slug
        name
        organization {
          id
          slug
        }
        teams(first: 500) {
          count
          edges {
            node {
              id
              accessLevel
              team {
                id
                name
                description
                slug
                members {
                  count
                }
                pipelines {
                  count
                }
              }
              permissions {
                teamPipelineUpdate {
                  allowed
                }
                teamPipelineDelete {
                  allowed
                }
              }
            }
          }
        }
      }
    }
  `,
  "build_show/annotations": Relay.QL`
    query BuildAnnotations($build: ID!) {
      build(slug: $build) {
        id
	annotations(first: 10) {
          edges {
            node {
              id
              style
              body {
                html
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  `,
  "graphql_console/snippet": Relay.QL`
    query GraphQLSnippet($uuid: String!) {
      graphQLSnippet(uuid: $uuid) {
        query
        operationName
        url
      }
    }
  `,
  "user_settings_navigation/organizations": Relay.QL`
    query UserSettingsNavigation {
      viewer {
        id
        organizations(first: 10) {
          edges {
            node {
              name
              slug
              permissions {
                pipelineView {
                  allowed
                  code
                }
              }
              id
            }
            cursor
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  `,
  "totp/viewer": Relay.QL`
    query TOTPViewer {
      viewer {
        id
        user {
          id
          hasPassword
        }
        totp {
          id
          verified
          recoveryCodes {
            id
            active
            codes {
              code
              consumed
            }
          }
        }
      }
    }
  `
};

class RelayPreloader {
  preload(id: string, payload: Object, variables: Object) {
    // Get the concrete query
    const concrete = QUERIES[id];
    if (!concrete) {
      throw new Error(`No concrete query defined for \`${id}\``);
    }

    // Create a Relay-readable GraphQL query with the variables loaded in
    const query = fromGraphQL.Query(concrete);
    query.__variables__ = variables;

    // Load it with the payload into the Relay store
    Relay.Store.getStoreData().handleQueryPayload(query, payload);
  }
}

export default new RelayPreloader();
