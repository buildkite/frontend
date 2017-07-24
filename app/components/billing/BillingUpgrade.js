import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import classNames from 'classnames';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import FormRadioGroup from '../shared/FormRadioGroup';
import Icon from '../shared/Icon';
import FormInputLabel from '../shared/FormInputLabel';

import { formatNumber } from '../../lib/number';
import { createCardToken } from '../../lib/credit-card';

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
    creditCardErrors: null,
    plan: "standard",
    interval: "monthly"
  }

  constructor(initialProps) {
    super(initialProps);

    // We'll store credit card details here as they change
    this.creditCard = {};

    // Set default form state from data boostrapped on the page
    this.state = { form: window._billing["form"], summary: window._billing["summary"] }
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
              <h1 className="h1 p0 m0 mb1">Upgrade your Subscription</h1>
              <p className="dark-gray m0 p0 mb4">You can learn more about the different plans on the <a href="/pricing" className="blue hover-navy text-decoration-none hover-underline">pricing page</a>.</p>

              <Panel>
                <Panel.Section>
                  <FormInputLabel label="Which plan do you want?" required={true} />

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
                    name="upgrade[interval]"
                    label="How often do you want to be billed?"
                    value={this.state.form.interval}
                    onChange={this.handleIntervalChange}
                    required={true}
                    options={[
                      { label: "Monthly", value: "monthly", help: "Pay month-to-month" },
                      { label: "Yearly", value: "yearly", help: "Pay for a year up front and get a discount", badge: `Save ${window._billing["intervals"]["yearly"]["discount"]}%` }
                    ]}
                  />
                </Panel.Section>

                <Panel.Section>
                  <strong className="block mb2">Subscription Summary</strong>

                  {this.renderSummary()}


                </Panel.Section>

                <BillingCreditCardForm disabled={this.state.saving} onChange={this.handleCreditCardFormChange} errors={this.state.creditCardErrors} />

                <Panel.Footer>
                  <Button loading={this.state.saving && "Upgrading…"} theme="success">Upgrade</Button>
                </Panel.Footer>
              </Panel>
            </div>
          </div>

          {this.renderCreditCardHiddenInputs()}
        </form>
      </DocumentTitle>
    );
  }

  renderCreditCardHiddenInputs() {
    let inputs = [];

    if (this.state.creditCardResponse) {
      for(let key in this.state.creditCardResponse) {
        inputs.push(
          <input type="hidden" name={`upgrade[credit_card][${key}]`} value={this.state.creditCardResponse[key]} key={key} />
        )
      }
    }

    return inputs;
  }

  renderSummary() {
    return (
      <div className="border border-gray rounded mb2">

        {this.state.summary.items.map((item, index) => {
          return (
            <div key={index} className="border-bottom border-gray p3 flex items-center">
              <div className="flex-auto">
                <div className="bold">{item["label"]}</div>
                <p className="m0 p0 dark-gray">{item["description"]}</p>
              </div>
              <div>
                <h3 className="h3 m0 p0 semi-bold">${item["price"] / 100}</h3>
              </div>
            </div>
          )
        })}

        <div className="p3 flex items-center bg-silver">
          <div className="right-align flex-auto">
            <h3 className="h3 m0 py1 semi-bold">${this.state.summary.price / 100} per month</h3>
          </div>
        </div>
      </div>
    )
  }

  renderPlan(id, plan) {
    const price = plan["price"] / 100;
    const limits = [];
    const features = [];

    limits.push(
      <span><strong>{formatNumber(plan.limits["agents"])}</strong> connected agents</span>,
      <span><strong>{formatNumber(plan.limits["users"])}</strong> included users</span>,
      <span><strong>{plan.limits["builds_per_month"] ? formatNumber(plan.limits["builds_per_month"]) : "Unlimited"}</strong> builds per month</span>
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

    const selected = (this.state.form.plan === id);
    const classes = classNames("p3", { "bg-silver": selected });

    return (
      <div className={classes}>
        <label className="flex">
          <div className="mr2">
            <input type="radio" name="upgrade[plan]" value={id} onChange={this.handlePlanChange} checked={selected} />
          </div>
          <div className="flex-auto">
            <h3 className="h3 m0 p0 mb1">{plan["label"]}</h3>
            <h4 className="h4 m0 p0 mb2 dark-gray regular">${price} per month</h4>

            <ul className="list-reset m0 p0 mb2" style={{ lineHeight: "23px" }}>
              {limits.map((el, idx) => <li key={idx}>{el}</li>)}
            </ul>

            <ul className="list-reset m0 p0 mb2" style={{ lineHeight: "23px" }}>
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

  refetchSummaryData() {
    console.log("fetch");
    fetch(`/organizations/${this.props.organization.slug}/billing/upgrade/preview`, {
      credentials: 'same-origin',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._csrf.token
      },
      body: JSON.stringify({ upgrade: this.state.form })
    }).then((response) => {
      response.json().then((json) => {
        this.setState({ refreshing: false, summary: json });
      });
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();

    // Switch the form to "saving" and clear and errors
    this.setState({ saving: true, creditCardErrors: [] });

    createCardToken(this.creditCard)
      .then((response) => {
        // Setting `creditCardResponse` render in a bunch of hidden fields that
        // contain all the credit card information we're allowed to save. Once
        // the render has finished, we can finally submit the form.
        this.setState({ creditCardResponse: response }, () => {
          this.form.submit();
        })
      }).catch((exception) => {
        this.setState({ creditCardErrors: exception.errors, saving: false });
      });
  };

  handlePlanChange = (event) => {
    let form = this.state.form
    form.plan = event.target.value;

    this.setState({ refreshing: true, form: form });
    this.refetchSummaryData();
  };

  handleIntervalChange = (event) => {
    let form = this.state.form
    form.interval = event.target.value;

    this.setState({ refreshing: true, form: form });
    this.refetchSummaryData();
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
