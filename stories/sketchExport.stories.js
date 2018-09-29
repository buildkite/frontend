/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

// TODO: Auto-calc this by search all story files for Sketch const exports

const buttons = require('./shared/Button.stories').Sketch;
const icon = require('./shared/Icon.stories').Sketch;
const typography = require('./typography.stories').Sketch;
const iconsFavorite = require('./components/icons/Favorite.stories').Sketch;
const buildState = require('./components/icons/BuildState.stories').Sketch;
const jobState = require('./components/icons/JobState.stories').Sketch;
const searchField = require('./shared/SearchField.stories').Sketch;
const panel = require('./shared/Panel.stories').Sketch;

storiesOf('Sketch', module)
  .add('Export', () => (
    <div>
      {buttons()}
      {icon()}
      {typography()}
      {iconsFavorite()}
      {buildState()}
      {jobState()}
      {searchField()}
      {panel()}
    </div>
  ));