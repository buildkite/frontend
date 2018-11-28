/* eslint-disable */

import * as React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';
import Environment from 'app/lib/relay/environment';
import {MockMakeFetch} from 'app/lib/relay/makeFetch';
import OrganizationShow from '..';

jest.mock('app/components/shared/Icon/svgContent', () => {});
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
  test('it renders', () => {

    Environment.create();
    MockMakeFetch.mockReturnValue(Promise.resolve({foo: 'bar'}))

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

    console.log('----------------------------')
    console.log(render.toTree())
    console.log(render.toJSON())
    console.log(render.root.children)
    console.log('----------------------------')
    console.log(MockMakeFetch)
  });
});
