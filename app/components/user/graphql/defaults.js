export const DEFAULT_QUERY_WITH_ORGANIZATION = `# Here is an example query! Check out the examples tab for more.

query {
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

export const DEFAULT_QUERY_NO_ORGANIZATION = `# Here is an example query! Check out the examples tab for more.

query {
  user {
    name
  }
}`;

