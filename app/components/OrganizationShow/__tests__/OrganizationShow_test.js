/* eslint-disable */

import * as React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';
import Environment from 'app/lib/relay/environment';
import {MockFetch} from 'app/lib/relay/makeFetch';
import OrganizationShow from '..';
import Teams from '../Teams';

import { graphql, buildClientSchema } from 'graphql';
import { addMockFunctionsToSchema } from 'graphql-tools';
import * as introspectionResult from 'app/graph/schema.json';

async function Derp() {
  const schema = buildClientSchema(introspectionResult.data);
  addMockFunctionsToSchema({schema, mocks: {
    DateTime: () => '123123123123',
    Pipeline: () => ({
      name: 'Foobar',
      description: 'OMGOMGOMGOMGOMGOGMGMG,'
    })
  }});

  const query = OrganizationShow.query.modern().text;
  const foo = await graphql(schema, query, null, null, {
    organizationSlug: 'foo',
    pageSize: 30
  });

  return foo;
}

jest.mock('app/lib/relay/makeFetch')

class MockRouterContext extends React.Component {
  static childContextTypes = {
    router: PropTypes.object,
  }

  getChildContext = () => ({
    router: {
      test: 2,
    },
  })

  render() {
    return this.props.children;
  }
}

describe.only('OrganizationShow', () => {
  test('it renders', async (done) => {

    const blah = Derp();

    Environment.create();
    MockFetch.mockResolvedValue(blah)

    const render = renderer.create(
      <MockRouterContext>
        <OrganizationShow
          {...{
            params: {
              organization: 'test'
            },
            location: {
              query: {}
            }
          }}
        />
      </MockRouterContext>
    );

    setTimeout(() => {
      expect(render.toJSON()).toMatchSnapshot()
      done()
    }, 2000)

    // console.log('----------------------------')
    // console.log(render.toTree())
    // console.log(render.toJSON())
    // console.log(render.root.children)
    // console.log('----------------------------')
    // console.log(MockFetch)
  });
});
