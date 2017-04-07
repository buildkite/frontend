import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import PageHeader from '../shared/PageHeader';

import permissions from '../../lib/permissions';

class SSOIndex extends React.PureComponent {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      permissions: React.PropTypes.object.isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <DocumentTitle title={`SSO · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Title>
              Single Sign On
            </PageHeader.Title>
            <PageHeader.Description>
              SSO enables you to automatically onboard users without having to manually invite them. SSO is available via SAML (Okta, Bitium, etc) or with GSuite (formally Google Apps).
            </PageHeader.Description>
          </PageHeader>
        </div>
      </DocumentTitle>
    );
  }
}

export default Relay.createContainer(SSOIndex, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        permissions {
          organizationUpdate {
            allowed
          }
        }
      }
    `
  }
});
