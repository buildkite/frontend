/* eslint-disable */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import GraphMock from 'jest/schemaMocks/mockGraphResolve';
import PropTypes from 'prop-types';
import Environment from 'app/lib/relay/environment';
import { MockFetch } from 'app/lib/relay/makeFetch';
import OrganizationShow from '..';
import Pipeline from '../Pipeline';

jest.mock('app/lib/RelayModernPreloader')
jest.mock('app/lib/relay/makeFetch')
jest.mock('app/components/shared/Icon/svgContent')

describe('OrganizationShow', () => {
  let wrapper;
  let graphMock;
  let graphMockTypes = {
    Organization: {
      slug: 'international-widgets',
      name: 'International Widgets',
      teams: {
        edges: [
          {
            node: {
              name: 'Team 1',
              slug: 'team-1',
              permissions: {
                pipelineView: {
                  allowed: true
                }
              }
            }
          }
        ]
      },
      permissions: {
        pipelineCreate: {
          allowed: true,
          code: '',
          message: ''
        }
      },
      pipelines: {
        edges: [
          {
            node: {
              name: 'Manufacture Velociraptors',
              description: "Raaaaawrr!"
            }
          },
        ]
      }
    }
  };

  beforeAll(() => {
    Environment.create();
    const query = OrganizationShow.query.modern().text;
    const variables = {organizationSlug: 'some-org', pageSize: 30};
    graphMock = GraphMock.create(query, variables, graphMockTypes);
  });

  async function render(props = {}) {
    const response = await graphMock.response();
    MockFetch.mockResolvedValueOnce(response);

    const component = (
      <OrganizationShow
        {...props}
        {...{ params: { organization: 'test' }, location: { query: {} } }}
      />
    );
    const context = { context: { router: { test: 2 } } };
    const rendered = mount(component, context);

    await (() => new Promise(resolve => setImmediate(resolve)))();
    rendered.update();
    return rendered;
  }

  describe('no pipelines', () => {
    beforeEach(async () => {
      graphMock.mocks.Organization.pipelines.edges.mock.mockReturnValue([]);
      wrapper = await render();
    });

    test('it renders', () => {
      expect.assertions(2);

      const welcome = wrapper.find('Welcome');
      expect(welcome.length).toEqual(1);
      expect(welcome.props()).toMatchObject({organization: {}, team: null});
    });
  })

  describe('multiple pipelines', () => {
    beforeEach(async () => {
      graphMock.mocks.Organization.pipelines.edges.mock.mockReturnValue([
        { node: { name: 'Pipeline 1', favorite: false, description: 'Reticulate splines!' } },
        { node: { name: 'Pipeline 2', favorite: false } },
        { node: { name: 'Pipeline 3', favorite: false } }
      ]);
      wrapper = await render();
    });

    test('it renders', () => {
      expect.assertions(5);

      // Renders 3 pipelines
      const pipelines = wrapper.find('[data-testid="pipeline"]');
      expect(pipelines.length).toEqual(3);

      // Pipeline render order
      expect(pipelines.at(0).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 1');
      expect(pipelines.at(0).find('[data-testid="pipeline__description"]').text()).toEqual('Reticulate splines!');
      expect(pipelines.at(1).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 2');
      expect(pipelines.at(2).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 3');
    });
  });

  describe('favorite pipelines', () => {
    beforeEach(async () => {
      graphMock.mocks.Organization.pipelines.edges.mock.mockReturnValue([
        { node: { name: 'Pipeline 1', favorite: false } },
        { node: { name: 'Pipeline 2', favorite: false } },
        { node: { name: 'Pipeline 3', favorite: true } },
        { node: { name: 'Pipeline 4', favorite: false } },
        { node: { name: 'Pipeline 5', favorite: true } },
      ]);
      wrapper = await render();
    });

    test('it renders', () => {
      expect.assertions(6);

      // Renders 5 pipelines
      const pipelines = wrapper.find('[data-testid="pipeline"]');
      expect(pipelines.length).toEqual(5);

      // 'Pipeline 3' and 'Pipeline 5' are going to be sorted to the top because they are favourites
      expect(pipelines.at(0).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 3');
      expect(pipelines.at(1).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 5');

      expect(pipelines.at(2).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 1');
      expect(pipelines.at(3).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 2');
      expect(pipelines.at(4).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 4');
    });
  });

  describe('public pipelines', () => {
    beforeEach(async () => {
      graphMock.mocks.Organization.pipelines.edges.mock.mockReturnValue([
        { node: { name: 'Pipeline 1', favorite: false, public: false } },
        { node: { name: 'Pipeline 2', favorite: false, public: true } },
        { node: { name: 'Pipeline 3', favorite: false, public: false } },
      ]);
      wrapper = await render();
    });

    test('it renders', () => {
      expect.assertions(8);

      // Renders 3 pipelines
      const pipelines = wrapper.find('[data-testid="pipeline"]');
      expect(pipelines.length).toEqual(3);

      // Pipeline 1 is private
      expect(pipelines.at(0).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 1');
      expect(pipelines.at(0).find('[data-testid="pipeline__status"]').exists()).toBeFalsy();

      // Pipeline 2 is public
      expect(pipelines.at(1).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 2');
      expect(pipelines.at(1).find('[data-testid="pipeline__status"]').exists()).toBeTruthy();
      expect(pipelines.at(1).find('[data-testid="pipeline__status"]').text()).toEqual('PUBLIC');

      // Pipeline 3 is private
      expect(pipelines.at(2).find('[data-testid="pipeline__name"]').text()).toEqual('Pipeline 3');
      expect(pipelines.at(2).find('[data-testid="pipeline__status"]').exists()).toBeFalsy();
    });
  });
});
