import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import FriendlyTime from '../../shared/FriendlyTime';

import { SectionHeading } from './shared';

class AuditLogContextSection extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      context: PropTypes.shape({
        __typename: PropTypes.string.isRequired,
        requestIpAddress: PropTypes.string,
        requestUserAgent: PropTypes.string,
        sessionCreatedAt: PropTypes.string
      }).isRequired
    }).isRequired
  };

  getContextName() {
    return this.props.auditEvent.context.__typename.replace(/^Audit|Context$/g, '');
  }

  render() {
    const { context } = this.props.auditEvent;

    return (
      <section className="mb4">
        <SectionHeading className="m0 mb2">
          {this.getContextName()} Context
        </SectionHeading>
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Request IP Address
          </dt>
          <dd className="ml0">
            {context.requestIpAddress}
          </dd>
          <dt className="mt1 dark-gray">
            Request User Agent
          </dt>
          <dd className="ml0">
            {context.requestUserAgent}
          </dd>
          <dt className="mt1 dark-gray">
            Session Started
          </dt>
          <dd className="ml0">
            <FriendlyTime value={context.sessionCreatedAt} />
          </dd>
        </dl>
      </section>
    );
  }
}

export default Relay.createContainer(AuditLogContextSection, {
  initialVariables: {
    hasExpanded: false
  },

  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
        context {
          __typename
          ...on AuditWebContext {
            requestIpAddress
            requestUserAgent
            sessionCreatedAt
          }
        }
      }
    `
  }
});
