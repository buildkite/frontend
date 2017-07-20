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
      </Section>
    );
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
