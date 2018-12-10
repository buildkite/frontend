/* eslint-disable */

import * as React from 'react';
import renderer from 'react-test-renderer';
import PropTypes from 'prop-types';
import Environment from 'app/lib/relay/environment';
import {MockFetch} from 'app/lib/relay/makeFetch';
import OrganizationShow from '..';
import Teams from '../Teams';

import GraphMock from 'jest/schemaMocks/mockGraphResolve';

jest.mock('app/lib/RelayModernPreloader')
jest.mock('app/lib/relay/makeFetch')
jest.mock('app/components/shared/Icon/svgContent')

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
  let graphMock;

  beforeEach(() => {
    Environment.create();

    const query = OrganizationShow.query.modern().text;
    const variables = {organizationSlug: 'some-org', pageSize: 30};

    graphMock = GraphMock.create(query, variables, {
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
                name: 'HERP DERP'
              }
            },
          ]
        }
      }
    });
  });

  test('it renders', async (done) => {
    expect.assertions(1);

    // console.log('JSON:\n', JSON.stringify(graphMock.mocks, null, 4));
    // console.log('==============================================================');
    // console.log('graphMock.mocks:\n', graphMock.mocks);
    // console.log('--------------------------------------------------------------');
    // console.log('graphMock.mocks.Organization:\n', graphMock.mocks.Organization);
    // console.log('--------------------------------------------------------------');
    console.log('graphMock.mocks.Organization.teams:\n', graphMock.mocks.Organization.teams);
    // console.log('--------------------------------------------------------------');
    // console.log('graphMock.mocks.Organization.teams.edges:\n', graphMock.mocks.Organization.teams.edges);

    const response = await graphMock.response();
    console.log(JSON.stringify(response, null, 4));

    MockFetch.mockResolvedValueOnce(response)

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

    setImmediate(() => {
      expect(render.toJSON()).toMatchSnapshot();
      done();
    });
  });
});
