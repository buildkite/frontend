import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import RevealableDownChevron from '../shared/Icon/RevealableDownChevron';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';

import { indefiniteArticleFor } from '../../lib/words';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

const SectionHeading = styled.h3`
  font-size: 1em;
  font-weight: 400;
  text-transform: uppercase;
`;

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      data: PropTypes.string,
      actor: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        uuid: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string.isRequired,
          avatar: PropTypes.shape({
            url: PropTypes.string.isRequired
          }).isRequired
        })
      }).isRequired,
      subject: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        uuid: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string.isRequired
        })
      }).isRequired,
      context: PropTypes.shape({
        __typename: PropTypes.string.isRequired,
        requestIpAddress: PropTypes.string,
        requestUserAgent: PropTypes.string,
        sessionCreatedAt: PropTypes.string
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isExpanded: false
  };

  getContextName() {
    return this.props.auditEvent.context.__typename.replace(/^Audit|Context$/g, '');
  }

  render() {
    const actorName = this.props.auditEvent.actor.name || this.props.auditEvent.actor.node && this.props.auditEvent.actor.node.name;

    return (
      <Panel.Row>
        <div>
          <div
            className="flex items-center cursor-pointer hover-bg-silver mxn3 py2 px3"
            style={{
              marginTop: -10
            }}
            onClick={this.handleHeaderClick}
          >
            <div className="flex-auto flex items-center">
              {this.props.auditEvent.actor.node && (
                <div className="flex-none self-start icon-mr">
                  <UserAvatar
                    style={{ width: 39, height: 39 }}
                    user={this.props.auditEvent.actor.node}
                  />
                </div>
              )}
              <div className="flex-auto md-flex lg-flex items-center">
                <h2 className="flex-auto line-height-3 font-size-1 h4 regular m0">
                  <span className="semi-bold">{actorName}</span>
                  <br />
                  {this.renderEventSentence()}
                </h2>
                <FriendlyTime
                  className="flex-none dark-gray"
                  value={this.props.auditEvent.occurredAt}
                />
              </div>
            </div>
            <div className="flex-none ml2">
              <RevealableDownChevron
                className="dark-gray"
                revealed={this.state.isExpanded}
              />
            </div>
          </div>
          <TransitionMaxHeight
            className="mxn3 overflow-hidden"
            style={{
              marginBottom: -10,
              maxHeight: this.state.isExpanded ? 1000 : 0
            }}
          >
            {this.renderDetailsDrawer()}
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  renderEventSentence() {
    const { type, subject } = this.props.auditEvent;

    // "ORGANIZATION_CREATED" => ["Organization", "Created"]
    const eventTypeSplit = type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase());

    // Last word of event type is the verb
    const eventVerb = eventTypeSplit.pop();

    // The remainder is presumed to be the subject type
    const eventSubjectType = eventTypeSplit.join(' ').toLowerCase();

    // Default subject - something like "a pipeline," "an organization"
    let renderedSubject = `${indefiniteArticleFor(eventSubjectType)} ${eventSubjectType}`;

    // Check we have a name for the subject, with fallback to the node if present
    let subjectName = subject.name || subject.node && subject.node.name;

    if (subjectName) {
      renderedSubject = `${eventSubjectType} “${subjectName}”`;

      if (type === 'ORGANIZATION_CREATED') {
        renderedSubject = `${renderedSubject} 🎉`;
      }
    }

    return `${eventVerb} ${renderedSubject}`;
  }

  renderDetailsDrawer() {
    if (this.state.loading) {
      return (
        <div className="px3 pt3 pb2 border-top border-gray">
          <Spinner style={{ margin: 9.5 }} />
        </div>
      );
    }

    return (
      <div className="px3 pt3 pb2 border-top border-gray">
        {this.renderEventSection()}
        {this.renderSubjectSection()}
        {this.renderActorSection()}
        {this.renderContextSection()}
      </div>
    );
  }

  renderEventSection() {
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

  renderSubjectSection() {
    const { subject } = this.props.auditEvent;

    return (
      <section className="mb4">
        <SectionHeading className="m0 mb2">
          Subject
        </SectionHeading>
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Subject Type
          </dt>
          <dd className="ml0">
            {subject.type}
          </dd>
          <dt className="mt1 dark-gray">
            Subject Name
          </dt>
          <dd className="ml0">
            {subject.name}
          </dd>
          <dt className="mt1 dark-gray">
            Subject UUID
          </dt>
          <dd className="ml0">
            {subject.uuid}
          </dd>
        </dl>
      </section>
    );
  }

  renderActorSection() {
    const { actor } = this.props.auditEvent;

    return (
      <section className="mb4">
        <SectionHeading className="m0 mb2">
          Actor
        </SectionHeading>
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Actor Type
          </dt>
          <dd className="ml0">
            {actor.type}
          </dd>
          <dt className="mt1 dark-gray">
            Actor Name
          </dt>
          <dd className="ml0">
            {actor.name}
          </dd>
          <dt className="mt1 dark-gray">
            Actor UUID
          </dt>
          <dd className="ml0">
            {actor.uuid}
          </dd>
        </dl>
      </section>
    );
  }

  renderContextSection() {
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

  handleHeaderClick = () => {
    const isExpanded = !this.state.isExpanded;

    this.setState({
      loading: true,
      isExpanded
    }, () => {
      this.props.relay.setVariables(
        {
          hasExpanded: true
        },
        (readyState) => {
          if (readyState.done) {
            this.setState({ loading: false });
          }
        }
      );
    });
  };
}

export default Relay.createContainer(AuditLogRow, {
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
        actor {
          name
          type
          uuid
          node {
            ...on User {
              name
              avatar {
                url
              }
            }
          }
        }
        subject {
          name
          type
          uuid
          node {
            ...on Organization {
              name
            }
            ...on Pipeline {
              name
            }
          }
        }
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
