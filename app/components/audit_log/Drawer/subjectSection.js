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
          {this.renderSubjectType(subject)}
          {this.renderSubjectName(subject)}
          {this.renderSubjectUuid(subject)}
        </dl>
      </Section>
    );
  }

  renderSubjectType({type}) {
    return [
      <dt className="mt1 dark-gray" key="type-title">
        Subject Type
      </dt>,
      <dd className="ml0 monospace" key="type-definition">
        {type}
      </dd>,
    ];
  }

  renderSubjectName({name, node}) {
    const renderedName = (node && node.name) || name;

    if (renderedName) {
      return [
        <dt className="mt1 dark-gray" key="name-title">
          Subject Name
        </dt>,
        <dd className="ml0" key="name-definition">
          {renderedName}
        </dd>,
      ];
    }
  }

  renderSubjectUuid({uuid}) {
    if (uuid) {
      return [
        <dt className="mt1 dark-gray" key="uuid-title">
          Subject UUID
        </dt>,
        <dd className="ml0 monospace" key="uuid-definition">
          {uuid}
        </dd>,
      ];
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
            ...on Team {
              name
            }
          }
        }
      }
    `
  }
});
