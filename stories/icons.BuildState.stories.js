/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import BuildState from '../app/components/icons/BuildState';
import BuildStates from '../app/constants/BuildStates';

storiesOf('Icons', module)
  .add('BuildState', () => (
    <table>
      <tbody>
        {Object.keys(BuildStates).map((state) => (
          <tr key={state}>
            <th>{state}</th>
            <td><BuildState.XSmall state={state} /></td>
            <td><BuildState.Small state={state} /></td>
            <td><BuildState.Regular state={state} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  ));