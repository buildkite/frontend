// @flow

import { graphql, buildClientSchema } from 'graphql';
import * as introspectionResult from 'app/graph/schema';
import addMockFunctionsToSchema from './addMockFunctionsToSchema';
const schema = buildClientSchema(introspectionResult.data);

function isArray(value: any): boolean {
  return Array.isArray(value);
}

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !isArray(value);
}

class MockAccessor {
  static wrap(mocks) {
    const { children } = new MockAccessor(mocks);
    return children;
  }

  constructor(value) {
    this.children = this.wrapRecursive(value);
  }

  wrapRecursive(item) {
    if (isArray(item)) {
      return item.reduce((acc, value) => (acc.concat(this.toNode(value))), []);
    }
    if (isObject(item)) {
      return Object.entries(item).reduce((acc, [key, value]) => ({ ...acc, [key]: this.toNode(value) }), {});
    }
    return item;
  }

  toNode(value) {
    const children = this.wrapRecursive(value);
    const mock = jest.fn(() => children);

    return new Proxy(mock, {
      get(target, property) {
        if (property === 'mock') {
          return mock;
        }
        if (property in children) {
          return Reflect.get(children, property);
        }
        return Reflect.get(target, property);
      }
    });
  }
}

export default class GraphMock {
  static create(query, variables = {}, mocks = {}) {
    return new GraphMock(query, variables, mocks);
  }

  constructor(query, variables, mocks: Object) {
    this.schema = schema;
    this.query = query;
    this.variables = variables;
    this.mocks = MockAccessor.wrap(mocks);
  }

  async response() {
    addMockFunctionsToSchema(this.schema, this.mocks);

    const response = await graphql(this.schema, this.query, null, null, this.variables);

    if (response.errors) {
      throw new Error(response.errors.reduce((acc, { message, locations, path }) => (
        acc.concat(
          `Error: ${message} ${locations.map(({ line, column }) => `[${line}:${column}]`).join(' ')}` +
          `\nPath: ${path.join(' → ')}`
        )
      ), []).join('\n\n'));
    }

    return response;
  }
}
