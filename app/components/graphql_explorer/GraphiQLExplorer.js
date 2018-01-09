import React from 'react';
import GraphiQL from 'graphiql';

require("graphiql/graphiql.css");

class GraphiQLExplorer extends React.Component {
  state = { performance: null };

  static defaultQuery = `# Welcome to the Buildkite GraphQL Explorer
#
# This is an in-browser IDE for writing, validating, and
# testing GraphQL queries on https://graphql.buildkite.com/v1
#
# Type queries into this side of the screen, and you will
# see intelligent typeaheads aware of the current GraphQL type schema and
# live syntax and validation errors highlighted within the text.
#
# To bring up the auto-complete at any point, just press Ctrl-Space.
#
# Press the run button above, or Cmd-Enter to execute the query, and the result
# will appear in the pane to the right.
#
# Here is a simple GraphQL query that will request your name and avatar URL

query SimpleQuery {
  viewer {
    user {
      name
      avatar {
        url
      }
    }
  }
}

# Here is a slightly more complex GraphQL query that will request not only your
# name, but the latest 10 builds for each of the build pipelines you can access.
# To run this query, you'll first need to remove the one above, then uncomment this
# one.
#
# query ComplexQuery {
#   viewer {
#     user {
#       name
#     }
#     organizations {
#       edges {
#         node {
#           name
#           pipelines {
#             edges {
#               node {
#                 name
#                 repository
#                 builds(first: 10) {
#                   edges {
#                     node {
#                       number
#                       message
#                     }
#                   }
#                 }
#               }
#             }
#           }
#         }
#       }
#     }
#   }
# }`;

  render() {
    let footer = null;
    if(this.state.performance) {
      footer = <GraphiQL.Footer><pre style={{paddingLeft: "10px", fontSize: "12px"}}>{this.state.performance.split("; ").join("\n")}</pre></GraphiQL.Footer>
    }

    return (
      <div style={{height: "100vh"}}>
        <GraphiQL fetcher={this._fetcher} defaultQuery={GraphiQLExplorer.defaultQuery}>
          <GraphiQL.Logo>
            <div style={{verticalAlign: "middle"}}>
              Buildkite GraphQL Explorer
            </div>
          </GraphiQL.Logo>
          {footer}
        </GraphiQL>
      </div>
    );
  }

  _fetcher = (params) => {
    return fetch(window._graphql['url'], {
      method: 'post',
      credentials: "same-origin",
      body: JSON.stringify(params),
      headers: window._graphql['headers']
    }).then(response => {
      // this.setState({ performance: response.headers.get('x-buildkite-performance') });
      return response;
    }).then(response => {
      return response.json();
    });
  };
}

export default GraphiQLExplorer;
