/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, boolean, select } from '@storybook/addon-knobs';

import TabControl from '../../app/components/shared/TabControl';

const basic = () => {
  const activeTab = select('Active Tab', ['1', '2', '3'], '1');

  return (
    <div data-sketch-symbol="TabControl">
      <TabControl>
        <div data-sketch-symbol-instance="TabControl/Tab (Active)">
          <TabControl.Tab to="" className={activeTab === '1' && "active"}>{text('Tab One Label', 'Tab One')}</TabControl.Tab>
        </div>
        <div data-sketch-symbol-instance="TabControl/Tab">
          <TabControl.Tab to="" className={activeTab === '2' && "active"}>{text('Tab Two Label', 'Tab Two')}</TabControl.Tab>
        </div>
        <div data-sketch-symbol-instance="TabControl/Tab">
          <TabControl.Tab to="" className={activeTab === '3' && "active"}>{text('Tab Three Label', 'Tab Three')}</TabControl.Tab>
        </div>
      </TabControl>
    </div>
  );
};

storiesOf('TabControl', module).add('Basic', basic);

const tab = () => {
  const active = boolean('Active', false);
  return (
    <TabControl>
      <div data-sketch-symbol="TabControl/Tab">
        <TabControl.Tab to="" className={active && 'active'}>{text('Tab Label', 'Tab Label')}</TabControl.Tab>
      </div>
    </TabControl>
  );
};

storiesOf('TabControl', module).add('Tab', tab);

const tabActive = () => {
  const active = boolean('Active', true);
  return (
    <TabControl>
      <div data-sketch-symbol="TabControl/Tab (Active)">
        <TabControl.Tab to="" className={active && 'active'}>{text('Tab Label', 'Tab Label')}</TabControl.Tab>
      </div>
    </TabControl>
  );
};

storiesOf('TabControl', module).add('Tab (Active)', tabActive);

export const Sketch = () => (
  <div>
    {tab()}
    {tabActive()}
    <div data-sketch-symbol="TabControl/Container">
      <TabControl>
        <span className="inline-block" style={{ height: 44 }}>{' '}</span>
      </TabControl>
    </div>
  </div>
)