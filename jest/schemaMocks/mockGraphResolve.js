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

class Node {
  constructor(mock, value) {
    this.mock = mock;
    this.value = value;
  }
}

// const mockProxyHandler = {
//   get(target, key) {
//     // console.log(key, target[key])
//     if (key === 'mock') {
//       console.log('------------------------------', key, target)
//       return target[key].mock;
//     }
//     if (isObject(target[key])) {
//       return new Proxy(target[key].value, mockProxyHandler);
//     }
//     return target[key];
//   }
// };

export default class GraphMock {
  static create(query, variables = {}, mocks = {}) {
    return new GraphMock(query, variables, mocks);
  }

  constructor(query, variables, mocks: Object) {
    this.schema = schema;
    this.query = query;
    this.variables = variables;
    this.foo = {};
    this.mocks = this.mockObject(mocks);

    // console.log('graphMock.mocks:', this.mocks.Organization().teams().edges());
  }

  // get mocks() {
  //   return new Proxy(this.mocks, mockProxyHandler);
  // }

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

  mockObject(mocks: Object) {
    return Object.entries(mocks).reduce((acc, [key, value]) => {
      const mock = this.mockReturnValue(value);
      const node = this.node(key, value, mock);
      return { ...acc, [key]: node };
    }, {});
  }

  mockArray(mocks: Array<*>) {
    return mocks.reduce((acc, value, index) => {
      const mock = this.mockReturnValue(value);
      const node = this.node(index, value, mock);
      return acc.concat(node);
    }, []);
  }

  mockReturnValue(value) {
    const mock = jest.fn();
    mock.mockReturnValue(isArray(value) ? this.mockArray(value) : isObject(value) ? this.mockObject(value) : value);
    return mock;
  }

  node(key, value, mock) {
    return new Proxy(
      new Node(mock, value),
      // { mock, value },
      {
        get(target, property) {
          console.log({property, key, target});

          if (property === 'mock') {
            return Reflect.get(target, 'mock');
          }
          return Reflect.get(target, 'value');
        }
      }
    );
  }
}
