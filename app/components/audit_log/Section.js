import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Icon from '../shared/Icon';
import PageHeader from '../shared/PageHeader';

class AuditLogSection extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      auditEvents: PropTypes.shape({
        edges: PropTypes.array
      }).isRequired
    }).isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Audit Log · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="eye"
                className="align-middle"
                style={{ width: 40, height: 40 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Audit Log
            </PageHeader.Title>
            <PageHeader.Description>
              Event log of all organization activity
            </PageHeader.Description>
          </PageHeader>

          {this.props.children}
        </div>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(AuditLogSection, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
      }
    `
  }
});
