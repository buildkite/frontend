import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';
import { v4 as uuid } from 'uuid';

import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import PageHeader from '../shared/PageHeader';
import Spinner from '../shared/Spinner';

import AuditLogRow from './row';

const PAGE_SIZE = 30;

class AuditLogIndex extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      auditEvents: PropTypes.shape({
        edges: PropTypes.array
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <DocumentTitle title={`Audit Log · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="eye"
                className="align-middle mr2"
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

          {this.renderDetailsPanel()}
        </div>
      </DocumentTitle>
    );
  }

  renderDetailsPanel() {
    return (
      <Panel>
        <Panel.Section>
          <span className="semi-bold">Controls and stuff go here</span>
        </Panel.Section>
        {this.props.organization.auditEvents.edges.map((edge) => (
          <AuditLogRow
            key={edge.node.id}
            auditEvent={edge.node}
          />
        ))}
      </Panel>
    );
  }
};

export default Relay.createContainer(AuditLogIndex, {
  initialVariables: {
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        auditEvents(first: $pageSize) {
          edges {
            node {
              id
              ${AuditLogRow.getFragment('auditEvent')}
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});
