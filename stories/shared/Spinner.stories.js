/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { boolean, number } from '@storybook/addon-knobs';

import Spinner from '../../app/components/shared/Spinner';

storiesOf('Spinner', module)
  .add('Standard', () => <Spinner color={boolean('Color', true)} size={number('Size', 20)} />)
  .add('Mono', () => <Spinner color={boolean('Color', false)} size={number('Size', 20)} />);