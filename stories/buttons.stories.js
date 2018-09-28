/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button, { NORMAL_THEMES } from '../app/components/shared/Button';

import { text, select, boolean } from '@storybook/addon-knobs';

storiesOf('Button', module)
  .add('Test', () => (
    <Button
      theme={select('Theme', Object.keys(NORMAL_THEMES), 'primary')}
      onClick={action('clicked')}
      outline={boolean('Outline', false)}
    >
      {text('Text', 'Button')}
    </Button>
  ))
  .add('Themes and Styles', () => (
    <div className="flex">
      <div className="mx1">
        <div className="my1"><Button theme="default">Default</Button></div>
        <div className="my1"><Button theme="primary">Primary</Button></div>
        <div className="my1"><Button theme="success">Success</Button></div>
        <div className="my1"><Button theme="warning">Warning</Button></div>
        <div className="my1"><Button theme="error">Error</Button></div>
      </div>
      <div className="mx1">
        <div className="my1"><Button theme="default" outline={true}>Default</Button></div>
        <div className="my1"><Button theme="primary" outline={true}>Primary</Button></div>
        <div className="my1"><Button theme="success" outline={true}>Success</Button></div>
        <div className="my1"><Button theme="warning" outline={true}>Warning</Button></div>
        <div className="my1"><Button theme="error" outline={true}>Error</Button></div>
      </div>
    </div>
  ));