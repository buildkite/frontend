export default {
  "ORG_FIRST_PIPELINES": {
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
}
