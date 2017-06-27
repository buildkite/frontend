import React from 'react';
import PropTypes from 'prop-types';
// import Relay, { graphql } from 'react-relay/compat';
import DocumentTitle from 'react-document-title';
import { v4 as uuid } from 'uuid';

import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import PageHeader from '../shared/PageHeader';
import Spinner from '../shared/Spinner';

import garbage from '../../lib/garbage';

import AuditLogRow from './row';

const generateOrganization = () => {
  const auditEventEdges = Array.apply(null, Array(Math.round(Math.random() * 10)))
    .map((_, index) => ({
      node: {
        id: btoa("AuditEvent" + uuid()),
        subject: garbage(),
        occurredAt: new Date(+new Date() - Math.random() * index * 86400).toISOString()
      }
    }));

  return {
    name: 'Acme Inc.',
    auditEvents: {
      edges: auditEventEdges,
      count: auditEventEdges.length
    }
  };
};

export default class AuditLogIndex extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      auditEvents: PropTypes.object.isRequired
    }).isRequired
  };

  static defaultProps = {
    organization: generateOrganization()
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
          <AuditLogRow key={edge.node.id} auditEvent={edge.node} />
        ))}
      </Panel>
    );
  }
};

// export default Relay.createPaginationContainer(
//   AuditLogIndex,
//   {
//     organization: graphql`
//       fragment Index_organization on Organization {
//         auditEvents(
//           first: $count
//           after: $cursor
//         ) @connection(key: "Index_auditEvents") {
//           edges {
//             node {
//               id
//               subject
//             }
//           }
//         }
//       }
//     `
//   },
//   {
//     direction: 'forward',
//     getConnectionFromProps(props) {
//       return props.organization && props.organization.auditEvents;
//     },
//     getFragmentVariables(prevVars, totalCount) {
//       return {
//         ...prevVars,
//         count: totalCount,
//       };
//     },
//     getVariables(props, {count, cursor}, fragmentVariables) {
//       return {
//         count,
//         cursor
//       };
//     },
//     query: graphql`
//       query IndexPaginationQuery(
//         $count: Int!
//         $cursor: String
//       ) {
//         organization {
//           ...Index_organization
//         }
//       }
//     `
//   }
// );
