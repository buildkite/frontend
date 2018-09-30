/* global module */

import React from 'react';
import { PropTypes } from 'prop-types';
import { storiesOf } from '@storybook/react';

const Export = ({ sketch }) => (
  <div className="my4">{sketch()}</div>
);
Export.propTypes = { sketch: PropTypes.func.isRequired };

storiesOf('Sketch', module)
  .add('Export', () => (
    // TODO: Auto-calc this by search all story files for Sketch const exports
    <div>
      <Export sketch={require('./shared/Button.stories').Sketch} />
      <Export sketch={require('./shared/Icon.stories').Sketch} />
      <Export sketch={require('./typography.stories').Sketch} />
      <Export sketch={require('./components/icons/Favorite.stories').Sketch} />
      <Export sketch={require('./components/icons/BuildState.stories').Sketch} />
      <Export sketch={require('./components/icons/JobState.stories').Sketch} />
      <Export sketch={require('./shared/SearchField.stories').Sketch} />
      <Export sketch={require('./shared/Panel.stories').Sketch} />
      <Export sketch={require('./shared/TabControl.stories').Sketch} />
    </div>
  ));