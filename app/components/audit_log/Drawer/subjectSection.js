import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import { Section, SectionHeading } from './shared';

class AuditLogSubjectSection extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      subject: PropTypes.shape({
        name: PropTypes.string,
        type: PropTypes.string,
        uuid: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string
        })
      }).isRequired
    }).isRequired
  };

  render() {
    const { subject } = this.props.auditEvent;

    return (
      <Section>
        <SectionHeading className="m0 mb2">
          Subject
        </SectionHeading>
        {this.renderSubjectType(subject)}
        {this.renderSubjectName(subject)}
        {this.renderSubjectUuid(subject)}
      </Section>
    );
  }

  renderSubjectType({type}) {
    return (
      <dl className="m0">
        <dt className="mt1 dark-gray">
          Subject Type
        </dt>
        <dd className="ml0">
          {type}
        </dd>
      </dl>
    );
  }

  renderSubjectName(subject) {
    const name = (subject.node && subject.node.name) || subject.name;

    if (name) {
      return (
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Subject Name
          </dt>
          <dd className="ml0">
            {name}
          </dd>
        </dl>
      );
    }
  }

  renderSubjectUuid({uuid}) {
    if (uuid) {
      return (
        <dl className="m0">
          <dt className="mt1 dark-gray">
            Subject UUID
          </dt>
          <dd className="ml0">
            {uuid}
          </dd>
        </dl>
      );
    }
  }
}

export default Relay.createContainer(AuditLogSubjectSection, {
  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
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
      }
    `
  }
});
