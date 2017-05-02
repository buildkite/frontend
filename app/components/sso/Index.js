import React from 'react';
import Relay from 'react-relay';
import DocumentTitle from 'react-document-title';

import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import PageHeader from '../shared/PageHeader';
import Spinner from '../shared/Spinner';

class SSOIndex extends React.PureComponent {
  static propTypes = {
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      sso: React.PropTypes.object
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`SSO · ${this.props.organization.name}`}>
        <div>
          {/* this is a custom PageHeader body. *
            * you may not like it,              *
            * but this is what that looks like  */}
          <section className="flex items-top mb4">
            <div className="flex-none">
              <Icon
                icon="sso"
                className="align-middle mr2"
                style={{ width: 40, height: 40 }}
              />
            </div>
            <div className="flex-auto">
              <PageHeader.Title>
                Single Sign On
              </PageHeader.Title>
              <PageHeader.Description>
                Manage your organization’s Single Sign On settings
              </PageHeader.Description>
            </div>
          </section>

          {this.renderDetailsPanel()}
        </div>
      </DocumentTitle>
    );
  }

  renderLoginLink() {
    const url = `/login?org=${this.props.organization.slug}`;

    return <a href={url}>{url}</a>;
  }

  renderDetailsPanel() {
    if (!this.props.organization.sso) {
      return (
        <Panel>
          <Panel.Section className="center">
            <Spinner />
          </Panel.Section>
        </Panel>
      );
    }

    if (this.props.organization.sso.isEnabled) {
      return (
        <Panel>
          <Panel.Section>
            <p>Single Sign On is enabled using {this.props.organization.sso.provider.name}</p>
            <p>Anyone with {this.props.organization.sso.provider.emailDomain} email address address can login to Buildkite by entering their email address on the login page.</p>
            <p>Your organization specific login URL is: {this.renderLoginLink()}</p>
          </Panel.Section>
        </Panel>
      );
    } else {
      return (
        <div>
          <Panel>
            <Panel.Section>
              <p>Single Sign On allows you require users to login to Buildkite using your own third-party authentication server. Once enabled, you’ll no longer have to invite users, as they’ll be automatically added to your organization when they go to login.</p>
              <p>Supported SSO systems:</p>
              <ul>
                <li>Bitium</li>
                <li>Okta</li>
                <li>Google Apps</li>
                <li>SAML</li>
                <li>ADFS (SAML)</li>
              </ul>
              <Button href="mailto:support@buildkite.com?subject=Please enable SSO for my account!">Contact Support to Enable SSO</Button>
            </Panel.Section>
          </Panel>
          <Panel className="mt4">
            <Panel.Section>
              <h2 className="h3" style={{ color: '#8E8E8E', fontWeight: 300 }}>Frequently Asked SSO Questions</h2>
              <h3 className="h4" style={{ fontWeight: 'normal' }}>How does user billing work with SSO? </h3>
              <p>When a user signs in with SSO, the additional user is added to your account and will be charged immediately, just as if you had invited them to the account.</p>
              <h3 className="h4" style={{ fontWeight: 'normal' }}>What type of encryption is supported? </h3>
              <p>We support AE256 and all types of great encryption. In addition, you can use the ROT13 algorithm for extra security.</p>
              <h3 className="h4" style={{ fontWeight: 'normal' }}>Can I use multiple email domains? </h3>
              <p>We currently only support a single email domain (e.g. example.com) for an organization.</p>
              <h3 className="h4" style={{ fontWeight: 'normal' }}>Can I set up SSO for additional organizations? </h3>
              <p>We support setting up SSO for additional organizations, but one of the organizations will be the default. To login to the secondary organizations, you can add ?asd to your organization’s login URL.</p>
            </Panel.Section>
          </Panel>
        </div>
      );
    }
  }
}

export default Relay.createContainer(SSOIndex, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        sso @include(if: $isMounted) {
          isEnabled
          provider {
            name
            ...on SSOProviderGoogle {
              emailDomain
            }
            ...on SSOProviderSAML {
              emailDomain
            }
          }
        }
      }
    `
  }
});
