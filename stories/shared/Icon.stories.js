/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import Icon from '../../app/components/shared/Icon';

const iconFiles = require.context('../../app/components/shared/Icon', true, /\.svg$/);

// keys look like './api-tokens.svg' but we need the 'api-token' part
const icons = iconFiles.keys().map((filename) => filename.replace(/^\.\//, '').replace(/\.svg$/, ''));

const iconSheet = () => (
  <div>
    {icons.map((icon) => (
      <span className="m1" key={icon}>
        <span data-sketch-symbol={`Icon/${icon}`}>
          <Icon icon={icon} title={icon} />
        </span>
      </span>
    ))}
  </div>
);

storiesOf('Icon', module).add('All', iconSheet);

export const Sketch = iconSheet;

icons.forEach((icon) => {
  storiesOf('Icon', module)
    .add(icon, () => <Icon key={icon} icon={icon} title={icon} />)
});