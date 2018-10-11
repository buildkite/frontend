/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import JobState from '../../../app/components/icons/JobState';
import JobStates from '../../../app/constants/JobStates';

const all = () => (
  <table>
    <tbody>
      {Object.keys(JobStates).map((state) => (
        <tr key={state}>
          <td className="pr2">{state}</td>
          <td data-sketch-symbol={`Icons/JobState/${state}`}>
            <JobState.Regular
              key={state}
              job={{ state: state, passed: boolean('Passed', true) }}
              className="align-middle"
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

storiesOf('Icons/JobState', module).add('All', all);

export const Sketch = all;

Object.keys(JobStates).map((state) => {
  storiesOf('Icons/JobState', module)
    .add(state, () => (
      <JobState.Regular job={{ state: state, passed: boolean('Passed', true) }} />
    ));
});
