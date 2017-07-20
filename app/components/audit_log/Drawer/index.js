import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Spinner from '../../shared/Spinner';

import AuditLogEventSection from './eventSection';
import AuditLogSubjectSection from './subjectSection';
import AuditLogActorSection from './actorSection';
import AuditLogContextSection from './contextSection';

class AuditLogDrawer extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    relay: PropTypes.object.isRequired
  };

  render() {
    if (this.props.loading) {
      return (
        <div className="px3 pt3 pb2 center">
          <Spinner style={{ margin: 9.5 }} />
        </div>
      );
    }

    return (
      <div
        className="px3 pt3 pb2"
        style={{
          columnWidth: '20em'
        }}
      >
        <AuditLogEventSection
          auditEvent={this.props.auditEvent}
          hasExpanded={this.props.relay.variables.hasExpanded}
        />
        <AuditLogSubjectSection
          auditEvent={this.props.auditEvent}
        />
        <AuditLogActorSection
          auditEvent={this.props.auditEvent}
        />
        <AuditLogContextSection
          auditEvent={this.props.auditEvent}
        />
      </div>
    );
  }
}

export default Relay.createContainer(AuditLogDrawer, {
  initialVariables: {
    hasExpanded: false
  },

  fragments: {
    auditEvent: ({ hasExpanded }) => Relay.QL`
      fragment on AuditEvent {
        ${AuditLogEventSection.getFragment('auditEvent', { hasExpanded })}
        ${AuditLogSubjectSection.getFragment('auditEvent')}
        ${AuditLogActorSection.getFragment('auditEvent')}
        ${AuditLogContextSection.getFragment('auditEvent')}
      }
    `
  }
});
