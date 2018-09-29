/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import Button from '../../app/components/shared/Button';
import Panel from '../../app/components/shared/Panel';
import SearchField from '../../app/components/shared/SearchField';

const withActions = () => (
  <Panel>
    <Panel.Header>
      {text('Row Header', 'Row Header')}
    </Panel.Header>
    {[0, 2, 3].map((index) => (
      <Panel.Row key={index}>
        <div className="flex flex-stretch items-center line-height-1">
          {text('Row Label', 'Panel Row')}
        </div>
      </Panel.Row>
    ))}
    <Panel.Footer>
      {text('Panel Footer', 'Panel Footer')}
    </Panel.Footer>
  </Panel>
);

storiesOf('Panel', module).add('Actions', withActions);

const withSearch = () => (
  <Panel>
    <Panel.Row>
      <div data-sketch-symbol-instance="SearchField/Empty">
        <SearchField
          placeholder="Search agents…"
          onChange={action('onChange')}
          searching={false}
        />
      </div>
    </Panel.Row>
    <Panel.Section className="dark-gray">
      No agents connected
    </Panel.Section>
  </Panel>
);

storiesOf('Panel', module).add('Search', withSearch);

export const Sketch = () => (
  <div>
    <div data-sketch-symbol="Panel/WithActions">{withActions()}</div>
    <div data-sketch-symbol="Panel/WithSearch">{withSearch()}</div>
  </div>
);