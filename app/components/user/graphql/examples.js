// @flow

export default [`# Getting the first 3 Pipelines of an Organization

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
}`,

  `# Listing the teams within your organization

query FirstThreeTeamsQuery {
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
}`,

  `# Creating an Agent Registration Token

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
}`,

  `# Revoking an Agent Registration Token

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
];
