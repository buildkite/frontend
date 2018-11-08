/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';

import Button, { NORMAL_THEMES } from '../../app/components/shared/Button';

const buttons = () => (
  <table>
    <tbody>
      {Object.keys(NORMAL_THEMES).map((theme) => (
        <tr key={theme}>
          <td className="align-middle pr2">{theme}</td>
          <td><span data-sketch-symbol={`Button/${theme}`}><Button theme={theme} className="m1">{text('Text', 'Rebuild')}</Button></span></td>
          <td><span data-sketch-symbol={`Button/${theme}-outline`}><Button theme={theme} className="m1" outline={true}>{text('Text', 'Rebuild')}</Button></span></td>
        </tr>
      ))}
    </tbody>
  </table>
);

storiesOf('Button', module).add('All', buttons);

export const Sketch = buttons;

Object.keys(NORMAL_THEMES).forEach((theme) => {
  storiesOf('Button/Solid', module)
    .add(theme, () => (
      <Button theme={theme} onClick={action('clicked')} outline={boolean('Outline', false)}>
        {text('Text', 'Rebuild')}
      </Button>
    ));
  storiesOf('Button/Outline', module)
    .add(theme, () => (
      <Button theme={theme} onClick={action('clicked')} outline={boolean('Outline', true)}>
        {text('Text', 'Rebuild')}
      </Button>
    ));
});
