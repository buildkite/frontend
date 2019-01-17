import prettier from "prettier/standalone";
import graphQLPlugin from "prettier/parser-graphql";

export default function(query) {
  return prettier.format(query, { parser: "graphql", plugins: [graphQLPlugin] });
}
