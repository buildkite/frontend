import React from 'react';

import { configure, addDecorator } from '@storybook/react';

// Addons
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// init the addons
addDecorator(checkA11y);
addDecorator(withKnobs);
addDecorator(centered);

// Import our CSS
import '../app/css/main.css';

configure(loadStories, module);
