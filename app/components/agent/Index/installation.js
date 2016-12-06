import React from 'react';

import Panel from '../../shared/Panel';

export default function AgentInstallation (props) {
  return (
    <Panel className="mb3">
      <Panel.Header>
        Installation documentation
      </Panel.Header>
      <Panel.Section>
        See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/installation">agent installation documentation</a> for the full details of installing and configuring your Buildkite agents for any machine or architecture.
      </Panel.Section>
    </Panel>
  );
};
