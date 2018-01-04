// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import FriendlyTime from '../../shared/FriendlyTime';

import { Section, SectionHeading } from './shared';

type Props = {
  auditEvent: {
    context: {
      __typename: string,
      requestIpAddress?: string,
      requestUserAgent?: string,
      sessionCreatedAt?: string
    }
  }
};

class AuditLogContextSection extends React.PureComponent<Props> {
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
      <Section>
        <SectionHeading className="m0 mb2">
          {this.getContextName()} Context
        </SectionHeading>
        <dl className="m0">
          {this.renderRequestIpAddress(context)}
          {this.renderRequestUserAgent(context)}
          {this.renderSessionCreatedAt(context)}
        </dl>
      </Section>
    );
  }

  renderRequestIpAddress({ requestIpAddress }) {
    if (requestIpAddress) {
      return [
        <dt className="mt1 dark-gray" key="requestIpAddress-title">
          Request IP Address
        </dt>,
        <dd className="ml0" key="requestIpAddress-definition">
          {requestIpAddress}
        </dd>
      ];
    }
  }

  renderRequestUserAgent({ requestUserAgent }) {
    if (requestUserAgent) {
      return [
        <dt className="mt1 dark-gray" key="requestUserAgent-title">
          Request User Agent
        </dt>,
        <dd className="ml0" key="requestUserAgent-definition">
          {requestUserAgent}
        </dd>
      ];
    }
  }

  renderSessionCreatedAt({ sessionCreatedAt }) {
    if (sessionCreatedAt) {
      return [
        <dt className="mt1 dark-gray" key="sessionCreatedAt-title">
          Session Started
        </dt>,
        <dd className="ml0" key="sessionCreatedAt-definition">
          <FriendlyTime value={sessionCreatedAt} />
        </dd>
      ];
    }
  }
}

export default Relay.createContainer(AuditLogContextSection, {
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
          ...on AuditAPIContext {
            requestIpAddress
            requestUserAgent
          }
        }
      }
    `
  }
});
