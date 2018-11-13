// @flow

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import DocumentTitle from 'react-document-title';

import Icon from 'app/components/shared/Icon';
import PageHeader from 'app/components/shared/PageHeader';
import TabControl from 'app/components/shared/TabControl';

type Props = {
  organization: {
    name: string,
    slug: string
  },
  children: React$Node
};

class AuditLogSection extends React.PureComponent<Props> {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.node.isRequired
  };

  render() {
    const auditLogURI = `/organizations/${this.props.organization.slug}/audit-log`;

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

          <TabControl>
            <TabControl.Tab to={auditLogURI} onlyActiveOnIndex={true}>
              Events
            </TabControl.Tab>
            <TabControl.Tab to={`${auditLogURI}/export`}>
              Query & Export
            </TabControl.Tab>
          </TabControl>

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
        slug
      }
    `
  }
});
