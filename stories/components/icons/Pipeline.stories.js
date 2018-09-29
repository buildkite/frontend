/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import Pipeline from '../../../app/components/icons/Pipeline';

storiesOf('Icons', module)
  .add('Pipeline', () => (
    <Pipeline />
  ));