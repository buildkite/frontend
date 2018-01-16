import React from "react";
import wrap from "word-wrap";

import Panel from "../../shared/Panel";

import { getGraphQLSchema } from "./graphql";

class Comment extends React.PureComponent {
  render() {
    return (
      <div className="cm-comment" style={{whiteSpace: "pre"}}>
        {wrap(this.props.text || "n/a", { width: 70, indent: "# ", newline: "\n# " })}
      </div>
    )
  }
}

class Field extends React.PureComponent {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <a className="cm-property underline-dotted text-decoration-none" href={`user/graphql/documentation?${this.props.name}`}>{this.props.name}</a>
        <span className="cm-punctuation">(</span>
        <span className="cm-punctuation">)</span>
      </span>
    );
  }
}

class Argument extends React.PureComponent {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-attribute">{this.props.name}</span>
      </span>
    );
  }
}

class Scalar extends React.PureComponent {
  render() {
    return (
      <span className="cm-s-graphql monospace">
        <span className="cm-atom">{this.props.name}</span>
      </span>
    );
  }
}

class GraphQLDocumentation extends React.Component {
  renderFields(root, fields) {
    const fieldEntries = Object.entries(fields);
    const totalFieldsCount = fieldEntries.length;

    let fieldNodes = fieldEntries.map(([name, field], fieldIndex) => {
      let argumentNodes = field.args.map((arg, argumentIndex) => {
        // Only include the ", " seperator between each argument (not after the
        // last one).
        let seperator;
        if ((argumentIndex + 1) != field.args.length && field.args.length > 1) {
          seperator = (
            <span className="cm-punctuation">, </span>
          );
        }

        return (
          <span key={arg.name}>
            <span className="cm-attribute">{arg.name}</span><span className="cm-punctuation">:</span> <Scalar name={arg.type.toString()} />{seperator}
          </span>
        );
      });

      // Insert an empty line between each field (except the last one).
      let fieldSeperatorNode;
      if ((fieldIndex + 1) != totalFieldsCount && totalFieldsCount > 1) {
        fieldSeperatorNode = (
          <div>&nbsp;</div>
        )
      }

      return (
        <div key={name} className="ml3" style={{fontSize: 12}}>
          <Comment text={field.description} />
          <div>
            <a className="cm-property underline-dotted text-decoration-none" href={`?field=${root}.${name}`}>{name}</a>
            <span className="cm-punctuation">(</span>
            {argumentNodes}
            <span className="cm-punctuation">)</span>
          </div>
          {fieldSeperatorNode}
        </div>
      )
    });

    return (
      <div className="CodeMirror cm-s-graphql">
        <div><span className="cm-keyword">{root}</span><span className="cm-punctuation"> {`{`}</span></div>
        {fieldNodes}
        <div><span className="cm-punctuation"> {`}`}</span></div>
      </div>
    )
  }

  render() {
    const schema = getGraphQLSchema();

    return (
      <div>
        <h2>Queries</h2>

        <p>
          <strong>GraphQL Queries</strong> are a way to fetch data in a read-only matter.
          The Buildkite GraphQL API offers 2 types of top-level query fields: "finders" and <Field name="viewer" />.
        </p>

        <p>
          The <Field name="viewer" /> field represents the current user using the GraphQL API (this will be you).
          This is the field you'll use when you want to write queries like <em>"retrieve all the organizations the current user has access to"</em>
          or <em>"get the current users name and email address"</em>.
        </p>

        <p>
          The other fields such as <Field name="agent" /> and <Field name="job" /> are "finder" fields and can be used to find objects in the GraphQL API.
        </p>

        <p>
          <Field name="node" /> is a special type of "finder" field that allows you to lookup any record using only it's GraphQL <Scalar name="ID" />.
          It doesn't matter if the <Scalar name="ID" /> you have is for a build, job or user, you can pass it's <Scalar name="ID" /> to this field, and it will return the
          associated record if it exists. This field is based on
          the <a href="http://facebook.github.io/relay/docs/en/graphql-server-specification.html#object-identification" className="blue hover-navy text-decoration-none hover-underline">Relay Object Identification Specification</a>.
        </p>

        <p>
          Below is the full list of fields we support as GraphQL queries. You can click through a field to learn more about how it's used and what it returns.
        </p>

        <div className="border border-gray rounded px2 py3" style={{borderLeftWidth: 4}}>
          {this.renderFields("query", schema.getQueryType().getFields())}
        </div>

        <h2>Mutations</h2>

        <p>
          <strong>GraphQL Mutations</strong> are GraphQL's write operations. Mutations have only 1 argument called <Argument name="input" /> and
          it's required for all mutations. The <Argument name="input" /> argument is where you'll supply the data that the mutation uses.
        </p>

        <p>
          Buildkite's GraphQL Mutations follow the <a href="https://facebook.github.io/relay/graphql/mutations.html" className="blue hover-navy text-decoration-none hover-underline">Relay Input Object Mutations Specification</a>.
        </p>

        <p>
          Below is the full list of mutations we support as GraphQL queries. You can click through a field to learn more about how it's used and what it returns.
        </p>

        <div className="border border-gray rounded px2 py3" style={{borderLeftWidth: 4}}>
          {this.renderFields("mutation", schema.getMutationType().getFields())}
        </div>
      </div>
    );
  }
}

export default GraphQLDocumentation;
