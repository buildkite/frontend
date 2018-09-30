/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

import Button from '../../app/components/shared/Button';
import Panel from '../../app/components/shared/Panel';
import FormTextField from '../../app/components/shared/FormTextField';
import SearchField from '../../app/components/shared/SearchField';
import { ShowMoreFooter } from '../../app/components/shared/ShowMoreFooter';

const basic = () => (
  <Panel>
    <Panel.Header>
      {text('Panel Header', 'Panel Header')}
    </Panel.Header>
    <Panel.Row>
      {text('Row Label', 'Panel Row')}
    </Panel.Row>
    <Panel.Footer>
      {text('Panel Footer', 'Panel Footer')}
    </Panel.Footer>
  </Panel>
);

storiesOf('Panel', module).add('Basic', basic);

const form = () => (
  <Panel>
    <Panel.Header>{text('Panel Header', 'New Build Schedule')}</Panel.Header>
    <Panel.Section>
      <FormTextField
        label="Description"
        help="The description for the schedule (supports :emoji:)"
        required={true}
      />
      <FormTextField
        label="Cron Interval"
        help={<span>The interval for when builds will be created, in UTC, using crontab format. See the <a className="lime" href="/docs/builds/scheduled-builds">Scheduled Builds</a> documentation for more information and examples.</span>}
        required={true}
      />
    </Panel.Section>
    <Panel.Footer>
      <Button loading={false} theme="success">{text('Button Label', 'Save Schedule')}</Button>
    </Panel.Footer>
  </Panel>
);

storiesOf('Panel', module).add('Form', form);

const list = () => (
  <Panel>
    <Panel.Header>
      {text('Panel Header', 'Agents')}
    </Panel.Header>
    <Panel.Row>
      <div data-sketch-symbol-instance="SearchField/Empty">
        <SearchField
          placeholder="Search agents…"
          onChange={action('onChange')}
          searching={false}
        />
      </div>
    </Panel.Row>
    <Panel.RowLink href="" className="line-height-1">
      agent-1
      <p className="m0 mt1 h5 dark-gray regular">queue=default</p>
    </Panel.RowLink>
    <Panel.RowLink href="" className="line-height-1">
      agent-2
      <p className="m0 mt1 h5 dark-gray regular">queue=osx osx=10.14</p>
    </Panel.RowLink>
    <Panel.Footer>
      <ShowMoreFooter connection={{ pageInfo: { hasNextPage: true } }} label="agents" />
    </Panel.Footer>
  </Panel>
);

storiesOf('Panel', module).add('List', list);

export const Sketch = () => (
  <div>
    <div data-sketch-symbol="Panel/Basic">{basic()}</div>
    <div data-sketch-symbol="Panel/List">{list()}</div>
    <div data-sketch-symbol="Panel/Form">{form()}</div>
  </div>
);