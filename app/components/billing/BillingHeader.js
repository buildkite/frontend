import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/compat';
import classNames from 'classnames';

import Icon from 'app/components/shared/Icon';
import PageHeader from 'app/components/shared/PageHeader';
import TabControl from 'app/components/shared/TabControl';

class BillingHeader extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      slug: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <div>
        <PageHeader>
          <PageHeader.Icon>
            <Icon
              icon="billing"
              style={{ width: 40, height: 40 }}
            />
          </PageHeader.Icon>
          <PageHeader.Title>
            Billing
          </PageHeader.Title>
          <PageHeader.Description>
            Manage your organization’s billing information, change your plan, and view your invoices
          </PageHeader.Description>
        </PageHeader>

        <TabControl>
          {this.renderTab(`/organizations/${this.props.organization.slug}/billing`, "Overview")}
          {this.renderTab(`/organizations/${this.props.organization.slug}/billing/invoices`, "Invoices")}
          {this.renderTab(`/organizations/${this.props.organization.slug}/billing/settings`, "Settings")}
        </TabControl>
      </div>
    );
  }

  renderTab(href, title) {
    const classes = classNames({
      "active": (window.location.pathname === href)
    });

    return (
      <TabControl.Tab href={href} className={classes}>{title}</TabControl.Tab>
    );
  }
}

export default Relay.createContainer(BillingHeader, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
      }
    `
  }
});
