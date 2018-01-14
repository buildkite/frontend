export default {
  "ORG_GET_PIPELINES": {
    query: `# Getting the first 3 Pipelines of an Organization

query FirstThreePipelinesQuery {
  organization(slug: $organizationSlug) {
    id
    name
    pipelines(first: 3) {
      edges {
        node {
          name
          description
          repository {
            url
          }
        }
      }
    }
  }
}`
  },

  "ORG_GET_TEAMS": {
    query: `# Listing the teams within your organization

query FirstThreePipelinesQuery {
  organization(slug: $organizationSlug) {
    teams(first: 3) {
      edges {
        node {
          name
          members(first: 10) {
            edges {
              node {
                role
                user {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}`
  },

  "CREATE_AGENT_TOKEN": {
    query: `# Creating an Agent Registration Token

mutation CreateAgentToken {
  agentTokenCreate(input: {
    organizationID: $organizationId,
    description: "My New Agent Registration Token"
  }) {
    agentTokenEdge {
      node {
        id
        description
        token
      }
    }
  }
}`
  },

  "REVOKING_AN_AGENT_TOKEN": {
    query: `# Revoking an Agent Registration Token

mutation RevokeAgentToken {
  agentTokenRevoke(input: {
    id: $agentTokenId,
    reason: "I accidently commited it to source control 😬"
  }) {
    agentToken {
      id
      description
      revokedAt
      revokedBy {
        name
      }
    }
  }
}`
  },
}
