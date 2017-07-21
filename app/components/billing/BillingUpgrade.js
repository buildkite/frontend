import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import FormRadioGroup from '../shared/FormRadioGroup';
import { formatNumber } from '../../lib/number';

import BillingCreditCardForm from './BillingCreditCardForm';

class BillingUpgrade extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    saving: false,
    plan: "standard",
    interval: "monthly"
  }

  // Internal variable used to store the credit card attributes as we change
  // them.
  creditCard = {};

  render() {
    return (
      <DocumentTitle title={`Upgrade · ${this.props.organization.name}`}>
        <form onSubmit={this.handleFormSubmit}>
          <div className="container">
            <div className="col-12 lg-col-8 mx-auto">
              <h1 className="h1 mb4">Upgrade your Subscription</h1>

              <Panel>
                <Panel.Section>
                  <strong className="mb2 block">Choose your plan</strong>

                  <div className="border border-gray rounded flex">
                    <div className="border-right border-gray col-6">
                      {this.renderPlan("standard", window._billing["plans"]["standard"])}
                    </div>
                    <div className="col-6">
                      {this.renderPlan("enterprise", window._billing["plans"]["enterprise"])}
                    </div>
                  </div>
                </Panel.Section>

                <Panel.Section>
                  <FormRadioGroup
                    name="interval"
                    label="How often do you want to be billed?"
                    value={this.state.interval}
                    onChange={this.handleIntervalChange}
                    options={[
                      { label: "Monthly", value: "monthly", help: "Pay month-to-month" },
                      { label: "Yearly", value: "yearly", help: "Save and pay for entire year up front", badge: "Save 15%" }
                    ]}
                  />
                </Panel.Section>

                <Panel.Section>
                  <strong className="block mb2">Order summary</strong>

                  <div className="border border-gray rounded mb2">
                    <div className="border-bottom border-gray p3 flex items-center">
                      <div className="flex-auto">
                        <div className="bold">Standard Plan</div>
                        <p className="m0 p0 dark-gray">Paying month-to-month</p>
                      </div>
                      <div>
                        <h3 className="h3 m0 p0 semi-bold">$49</h3>
                      </div>
                    </div>

                    <div className="border-bottom border-gray p3 flex items-center">
                      <div className="flex-auto">
                        <div className="bold">12 Users</div>
                        <p className="m0 p0 dark-gray">Each additional user costs $7 each</p>
                      </div>
                      <div>
                        <h3 className="h3 m0 p0 semi-bold">$84</h3>
                      </div>
                    </div>

                    <div className="p3 flex items-center bg-silver">
                      <div className="right-align flex-auto">
                        <h3 className="h3 m0 p0 semi-bold">$133 per month</h3>
                        <p className="m0 p0 dark-gray">Your next invoice will be issued on the <strong>19th of July, 2017</strong></p>
                      </div>
                    </div>
                  </div>

                </Panel.Section>

                <BillingCreditCardForm disabled={this.state.saving} onChange={this.handleCreditCardFormChange} />

                <Panel.Footer>
                  <Button loading={this.state.saving && "Upgrading…"} theme="success">Upgrade</Button>
                </Panel.Footer>
              </Panel>
            </div>
          </div>
        </form>
      </DocumentTitle>
    );
  }

  renderPlan(id, plan) {
    const price = plan["price"] / 100;
    const features = [];

    features.push(
      <span><strong>{formatNumber(plan.limits["agents"])}</strong> connected agents</span>,
      <span><strong>{formatNumber(plan.limits["users"])}</strong> included users</span>,
      <span><strong>{plan.limits["builds_per_month"] ? formatNumber(plan.limits["builds_per_month"]) : "Unlimited"}</strong> builds</span>
    );

    if (plan.features["custom_retention"]) {
      features.push(
        <span><strong>Customizable</strong> retention</span>
      );
    } else {
      features.push(
        <span><strong>{formatNumber(plan.limits["data_retention_days"])}</strong> days retention</span>
      );
    }

    features.push(
      <span className={classNames({ "gray": !plan.features["sso"] })}>SSO</span>
    );

    if (plan.features["chat_support"] && plan.features["priority_support"]) {
      features.push(
        <span>Priority email + chat support</span>
      );
    } else {
      features.push(
        <span className={classNames({ "gray": !plan.features["priority_support"] })}>Priority email support</span>
      );
    }

    features.push(
      <span className={classNames({ "gray": !plan.features["account_manager"] })}>Account manager</span>,
      <span className={classNames({ "gray": !plan.features["audit_logging"] })}>Audit logging</span>,
      <span className={classNames({ "gray": !plan.features["uptime_sla"] })}>99.95% update SLA</span>,
      <span className={classNames({ "gray": !plan.features["bank_transfer"] })}>Invoice payment</span>
    );

    const selected = (this.state.plan === id);
    const classes = classNames("p3", {
      "bg-silver": selected
    });

    return (
      <div className={classes}>
        <label className="flex">
          <div className="mr2">
            <input type="radio" value={id} onChange={this.handlePlanChange} checked={selected} />
          </div>
          <div className="flex-auto">
            <h3 className="h3 m0 p0 mb1">{plan["label"]}</h3>
            <h4 className="h4 m0 p0 mb2 dark-gray regular">${price} per month</h4>

            <ul className="list-reset m0 p0" style={{ lineHeight: "23px" }}>
              {features.map((el, idx) => <li key={idx}>{el}</li>)}
            </ul>
          </div>
        </label>
      </div>
    );
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ saving: true });
  };

  handlePlanChange = (event) => {
    this.setState({ plan: event.target.value });
  };

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  };

  handleCreditCardFormChange = (field, value) => {
    this.creditCard[field] = value;
  };
}

export default Relay.createContainer(BillingUpgrade, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
      }
    `
  }
});
