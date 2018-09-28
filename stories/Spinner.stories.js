/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import Spinner from '../app/components/shared/Spinner';

storiesOf('Spinner', module)
  .add('Test', () => (
    <div>
      <Spinner />
      <Spinner color={false} />
      <Spinner size={40} />
      <Spinner size={40} color={false} />
    </div>
  ));