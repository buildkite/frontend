import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import { Section, SectionHeading } from './shared';

class AuditLogEventSection extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      data: PropTypes.string
    }).isRequired
  };

  render() {
    const { auditEvent } = this.props;

    return (
      <Section>
        <SectionHeading className="m0 mb2">
          Event
        </SectionHeading>
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Event Timestamp
          </dt>
          <dd className="ml0">
            {auditEvent.occurredAt}
          </dd>
          <dt className="mt1 dark-gray">
            Event UUID
          </dt>
          <dd className="ml0 monospace">
            {auditEvent.uuid}
          </dd>
          <dt className="mt1 dark-gray">
            Event Type
          </dt>
          <dd className="ml0 monospace">
            {auditEvent.type}
          </dd>
          {this.renderEventData(auditEvent.data)}
        </dl>
      </Section>
    );
  }

  renderEventData(data) {
    // Only render event data if there is any data
    if (data && data != "{}") {
      const prettyData = JSON.stringify(JSON.parse(data), null, '  ');

      return [
        <dt className="mt1 dark-gray" key="data-title">
          Event Data
        </dt>,
        <dd className="ml0" key="data-definition">
          <pre className="border border-gray rounded bg-silver overflow-auto p2 monospace">{prettyData}</pre>
        </dd>,
      ];
    }
  }
}

export default Relay.createContainer(AuditLogEventSection, {
  initialVariables: {
    hasExpanded: false
  },

  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
        uuid
        type
        occurredAt
        data @include(if: $hasExpanded)
      }
    `
  }
});
