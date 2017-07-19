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
    loading: PropTypes.bool.isRequired
  };

  render() {
    if (this.props.loading) {
      return (
        <div className="px3 pt3 pb2 border-top border-gray">
          <Spinner style={{ margin: 9.5 }} />
        </div>
      );
    }

    return (
      <div className="px3 pt3 pb2 border-top border-gray">
        <AuditLogEventSection
          auditEvent={this.props.auditEvent}
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
    auditEvent: (variables) => Relay.QL`
      fragment on AuditEvent {
        ${AuditLogEventSection.getFragment('auditEvent', variables)}
        ${AuditLogSubjectSection.getFragment('auditEvent', variables)}
        ${AuditLogActorSection.getFragment('auditEvent', variables)}
        ${AuditLogContextSection.getFragment('auditEvent', variables)}
      }
    `
  }
});
