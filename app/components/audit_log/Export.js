// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';

const exampleQuery = (slug) => `query {
  organization(slug: "${slug}") {
    auditEvents(first: 500) {
      edges {
        node {
          type
          occurredAt
          actor {
            name
          }
          subject {
            name
            type
          }
          data
        }
      }
    }
  }
}`;

type Props = {
  organization: {
    slug: string
  }
};

class AuditLogExport extends React.PureComponent<Props> {
  static propTypes = {
    organization: PropTypes.shape({
      slug: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const linkClassName = 'text-decoration-none semi-bold lime hover-lime hover-underline';

    return (
      <div>
        <p>
          Your organizationʼs audit log can be queried and exported using the <a href="/docs/graphql-api" className={linkClassName}>GraphQL API</a>.
        </p>
        <p>For example:</p>
        <pre className="border border-gray rounded bg-silver overflow-auto p2 monospace">
          {exampleQuery(this.props.organization.slug)}
        </pre>
        <p>
          See the <a href="/docs/graphql-api" className={linkClassName}>GraphQL Documentation</a> for more information.
        </p>
      </div>
    );
  }
}

export default Relay.createContainer(AuditLogExport, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `
  }
});
