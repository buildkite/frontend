import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Button from '../shared/Button';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import PageHeader from '../shared/PageHeader';
import Spinner from '../shared/Spinner';

class SSOIndex extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      sso: PropTypes.object
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.forceFetch({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`SSO · ${this.props.organization.name}`}>
        <div>
          <PageHeader>
            <PageHeader.Icon>
              <Icon
                icon="sso"
                className="align-middle mr2"
                style={{ width: 40, height: 40 }}
              />
            </PageHeader.Icon>
            <PageHeader.Title>
              Single Sign On
            </PageHeader.Title>
            <PageHeader.Description>
              Manage your organization’s Single Sign On settings
            </PageHeader.Description>
          </PageHeader>

          {this.renderDetailsPanel()}
        </div>
      </DocumentTitle>
    );
  }

  renderLoginLink() {
    const url = `${window.location.origin}/login?org=${this.props.organization.slug}`;

    return (
      <a
        href={url}
        className="semi-bold lime text-decoration-none hover-lime hover-underline"
        onClick={this.handleLoginLinkClick}
      >
        {url}
      </a>
    );
  }

  handleLoginLinkClick(evt) {
    evt.preventDefault();
    alert('You’re already logged in! You can copy the link from here to share it.');
  }

  renderEmailURI() {
    const { organization } = this.props;

    const address = 'support@buildkite.com';
    const subject = (
      `Please enable SSO for ${organization.name} (“${organization.slug}”)`
    );

    return `mailto:${address}?subject=${encodeURIComponent(subject)}`;
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
          <Panel.Section className="max-width-3">
            <p className="h4 bold">Single Sign On is enabled for this organization.</p>
            <p>To login, users can enter their their email address on the Buildkite login page and they will redirected to {this.props.organization.sso.provider.name} for authentication and sign-in.</p>
            <p>If you have multiple organizations configured with SSO, users can login using this organization-specific login URL:<br />{this.renderLoginLink()}</p>
          </Panel.Section>
        </Panel>
      );
    }

    return (
      <div>
        <Panel>
          <Panel.Section className="max-width-3">
            <p>Single Sign On (SSO) allows you to use your own authentication server for signing into Buildkite.</p>
            <p>During the sign in process, new users will be automatically added to your organization.</p>
            <p>Supported SSO systems:</p>
            <ul>
              <li>Bitium (<a className="semi-bold lime text-decoration-none hover-lime hover-underline" href="https://support.bitium.com/administration/saml-buildkite/">Instructions</a>)</li>
              <li>Okta (<a className="semi-bold lime text-decoration-none hover-lime hover-underline" href="http://saml-doc.okta.com/SAML_Docs/How-to-Configure-SAML-2.0-for-Buildkite.html">Instructions</a>)</li>
              <li>Google Apps (G Suite)</li>
              <li>SAML</li>
              <li>ADFS (SAML)</li>
            </ul>
            <p>To enable SSO for this organization, contact support with your authentication server details.</p>
            <Button href={this.renderEmailURI()}>
              Contact Support
            </Button>
          </Panel.Section>
        </Panel>
        <Panel className="mt4">
          <Panel.Header>
            Frequently Asked SSO Questions
          </Panel.Header>
          <Panel.Section className="max-width-2">
            <h3 className="mt3 h4 bold">How does user billing work with SSO?</h3>
            <p>When a user signs in with SSO, the additional user is added to your account and will be charged immediately, just as if you had invited them to the account.</p>
            <h3 className="mt3 h4 bold">Can I use multiple email domains?</h3>
            <p>We currently only support a single email domain (e.g. example.com) for an organization.</p>
            <h3 className="mt3 h4 bold">Can I set up SSO for additional organizations?</h3>
            <p>We support setting up SSO for additional organizations, but one of the organizations will be the default. To login to the secondary organizations, you can add ?asd to your organization’s login URL.</p>
          </Panel.Section>
        </Panel>
      </div>
    );
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
