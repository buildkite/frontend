import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import { SectionHeading } from './shared';

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

    let eventData;

    if (auditEvent.data) {
      const parsed = JSON.parse(auditEvent.data);

      if (parsed) {
        const rendered = JSON.stringify(parsed, null, '  ');

        // if this renders to a string longer than `{}`, show it
        if (rendered.length > 2) {
          eventData = (
            <pre className="border border-gray rounded bg-silver overflow-auto p2 monospace">
              {rendered}
            </pre>
          );
        }
      }
    }

    if (!eventData) {
      // otherwise, looks like there weren't any captured data changes!
      eventData = (
        <i>No data changes were found</i>
      );
    }

    return (
      <section className="mb4">
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
          <dd className="ml0">
            {auditEvent.uuid}
          </dd>
          <dt className="mt1 dark-gray">
            Event Type
          </dt>
          <dd className="ml0">
            {auditEvent.type}
          </dd>
          <dt className="mt1 dark-gray">
            Event Data
          </dt>
          <dd className="ml0">
            {eventData}
          </dd>
        </dl>
      </section>
    );
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
