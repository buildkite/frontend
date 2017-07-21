import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import { Section, SectionHeading } from './shared';

class AuditLogActorSection extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
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
      }).isRequired
    }).isRequired
  };

  render() {
    const { actor } = this.props.auditEvent;

    return (
      <Section>
        <SectionHeading className="m0 mb2">
          Actor
        </SectionHeading>
        <dl className="m0">
          {this.renderActorType(actor)}
          {this.renderActorName(actor)}
          {this.renderActorUuid(actor)}
        </dl>
      </Section>
    );
  }

  renderActorType({type}) {
    return [
      <dt className="mt1 dark-gray" key="type-title">
        Actor Type
      </dt>,
      <dd className="ml0" key="type-definition">
        {type}
      </dd>,
    ];
  }

  renderActorName({name, node}) {
    const renderedName = (node && node.name) || name;

    if (renderedName) {
      return [
        <dt className="mt1 dark-gray" key="name-title">
          Actor Name
        </dt>,
        <dd className="ml0" key="name-definition">
          {renderedName}
        </dd>,
      ];
    }
  }

  renderActorUuid({uuid}) {
    if (uuid) {
      return [
        <dt className="mt1 dark-gray" key="uuid-title">
          Actor UUID
        </dt>,
        <dd className="ml0" key="uuid-definition">
          {uuid}
        </dd>,
      ];
    }
  }
}

export default Relay.createContainer(AuditLogActorSection, {
  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
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
      }
    `
  }
});
