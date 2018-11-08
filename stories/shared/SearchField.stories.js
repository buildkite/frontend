/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';

import SearchField from '../../app/components/shared/SearchField';

const empty = () => (
  <SearchField
    placeholder={text("Placeholder", "Search agents…")}
    defaultValue={text("Value", null)}
    searching={boolean('Searching', false)}
    onChange={action('onChange')}
  />
);

const searching = () => (
  <SearchField
    placeholder={text("Placeholder", "Search agents…")}
    defaultValue={text("Value", "queue=osx")}
    searching={boolean('Searching', true)}
    onChange={action('onChange')}
  />
);

storiesOf('SearchField', module).add('Empty', empty);
storiesOf('SearchField', module).add('Searching', searching);

export const Sketch = () => (
  <div>
    <div data-sketch-symbol="SearchField/Empty">{empty()}</div>
    <div data-sketch-symbol="SearchField/Searching">{searching()}</div>
  </div>
);