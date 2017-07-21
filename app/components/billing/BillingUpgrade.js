import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import FormRadioGroup from '../shared/FormRadioGroup';
import Icon from '../shared/Icon';
import { formatNumber } from '../../lib/number';
import FormInputLabel from '../shared/FormInputLabel';

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


  constructor(initialProps) {
    super(initialProps);

    // We'll store credit card details here as they change
    this.creditCard = {};

    // Set default form state from data boostrapped on the page
    this.state = window._billing["form"];
  }

  render() {
    return (
      <DocumentTitle title={`Upgrade · ${this.props.organization.name}`}>
        <form
          action={`/organizations/${this.props.organization.slug}/billing/upgrade`}
          acceptCharset=""
          method="POST"
          ref={(form) => this.form = form}
          onSubmit={this.handleFormSubmit}
        >
          <input type="hidden" name="utf8" value="✓" />
          <input type="hidden" name="_method" value="put" />
          <input type="hidden" name={window._csrf.param} value={window._csrf.token} />

          <div className="container">
            <div className="col-12 lg-col-8 mx-auto">
              <h1 className="h1 mb4">Upgrade your Subscription</h1>

              <Panel>
                <Panel.Section>
                  <FormInputLabel label="Choose your plan" required={true} />

                  <div className="border border-gray rounded flex mt2">
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
                    required={true}
                    options={[
                      { label: "Monthly", value: "monthly", help: "Pay month-to-month" },
                      { label: "Yearly", value: "yearly", help: "Save and pay for entire year up front", badge: `Save ${window._billing["intervals"]["yearly"]["discount"]}%` }
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
                        <h3 className="h3 m0 p0 semi-bold mb1">$133 per month</h3>
                        <p className="m0 p0">Your next invoice will be issued on the <strong>19th of July, 2017</strong></p>
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
    const limits = [];
    const features = [];

    limits.push(
      <span><strong>{formatNumber(plan.limits["agents"])}</strong> connected agents</span>,
      <span><strong>{formatNumber(plan.limits["users"])}</strong> included users</span>,
      <span><strong>{plan.limits["builds_per_month"] ? formatNumber(plan.limits["builds_per_month"]) : "Unlimited"}</strong> builds</span>
    );

    if (plan.features["custom_retention"]) {
      limits.push(
        <span><strong>Customizable</strong> retention</span>
      );
    } else {
      limits.push(
        <span><strong>{formatNumber(plan.limits["data_retention_days"])}</strong> days retention</span>
      );
    }

    features.push(this.renderFeature(plan, "sso", "Single Sign On"))

    if (plan.features["chat_support"] && plan.features["priority_support"]) {
      features.push(
        <span>{this.renderTick()}Priority email + chat support</span>
      );
    } else {
      features.push(
        <span className={classNames({ "gray": !plan.features["priority_support"] })}>{this.renderTick()}Priority email support</span>
      );
    }

    features.push(
      this.renderFeature(plan, "account_manager", "Account manager"),
      this.renderFeature(plan, "audit_logging", "Audit logging"),
      this.renderFeature(plan, "uptime_sla", "99.95% uptime SLA"),
      this.renderFeature(plan, "bank_transfer", "Invoice payment")
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

            <ul className="list-reset m0 p0 mb2" style={{ lineHeight: "23px" }}>
              {limits.map((el, idx) => <li key={idx}>{el}</li>)}
            </ul>

            <ul className="list-reset m0 p0" style={{ lineHeight: "23px" }}>
              {features.map((el, idx) => <li key={idx}>{el}</li>)}
            </ul>
          </div>
        </label>
      </div>
    );
  }

  renderFeature(plan, feature, label) {
    if(plan.features[feature]) {
      return (
        <span>{this.renderTick()}{label}</span>
      )
    } else {
      return (
        <span className="gray"><span className="mr1">✖</span>{label}</span>
      )
    }
  }

  renderTick() {
    return (
      <span className="lime mr1">✔</span>
    )
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.setState({ saving: true });
    setTimeout(() => {
      this.form.submit();
    }, 3000);
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
