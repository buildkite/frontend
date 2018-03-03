export const DEFAULT_QUERY_WITH_ORGANIZATION = `# Here is an example query! Check out the "Examples" tab for more.

query AllPipelinesQuery {
  organization(slug: $organizationSlug) {
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
}`;

export const DEFAULT_QUERY_NO_ORGANIZATION = `# Here is an example query! Check out the "Examples" tab for more.

query MyDetailsQuery {
  viewer {
    user {
      name
    }
  }
}`;
