/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import JobState from '../app/components/icons/JobState';
import JobStates from '../app/constants/JobStates';

storiesOf('Icons', module)
  .add('JobState', () => (
    <table>
      <tbody>
        {Object.keys(JobStates).map((state) => (
          <tr key={state}>
            <th>{state}</th>
            <td><JobState.XSmall job={{ state: state, passed: true }} /></td>
            <td><JobState.Small job={{ state: state, passed: true }} /></td>
            <td><JobState.Regular job={{ state: state, passed: true }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ));