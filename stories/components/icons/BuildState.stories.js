/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import BuildState from '../../../app/components/icons/BuildState';
import BuildStates from '../../../app/constants/BuildStates';

const all = () => (
  <table>
    <tbody>
      {Object.keys(BuildStates).map((state) => (
        <tr key={state}>
          <td className="align-middle pr2">{state}</td>
          <td data-sketch-symbol={`Icons/BuildState/${state}`}><BuildState.Regular state={state} className="align-middle" /></td>
        </tr>
      ))}
    </tbody>
  </table>
);

storiesOf('Icons/BuildState', module)
  .add('All', all);

Object.keys(BuildStates).map((state) => {
  storiesOf('Icons/BuildState', module)
    .add(state, () => (
      <BuildState.Regular state={state} />
    ));
});

export const Sketch = all;