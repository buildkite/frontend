/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import FormYAMLEditorField from '../app/components/shared/FormYAMLEditorField';

const exampleYaml = `steps:
  - label: ':yarn:'
    command: 'yarn test'
  - label: ':dust:'
    command: 'yarn lint'
  - wait
  - trigger: 'deploy'`;

storiesOf('FormatYAMLEditorField', module)
  .add('Test', () => (
    <FormYAMLEditorField name="yaml" value={exampleYaml} />
  ));