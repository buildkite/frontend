/* eslint-disable */

import * as React from 'react';
import renderer from 'react-test-renderer';
import OrganizationShow from '../Show';

jest.mock('app/components/shared/Icon/svgContent', () => {});

describe.skip('OrganizationShow', () => {
  test('it renders', () => {
    const component = renderer.create(
      <OrganizationShow />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
