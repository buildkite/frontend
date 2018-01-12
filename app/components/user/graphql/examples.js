export default {
  "ORG_FIRST_PIPELINES": {
    name: "Getting the first 3 Pipelines of an Organization",
    query: `query {
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
    name: "Creating an Agent Registration Token",
    query: `mutation {
  agentTokenCreate(input: {
    organizationID: $organizationId,
    description: "New Registration Token"
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
