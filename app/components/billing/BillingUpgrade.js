import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';

import Panel from '../shared/Panel';
import Button from '../shared/Button';
import FormRadioGroup from '../shared/FormRadioGroup';

import BillingCreditCardForm from './BillingCreditCardForm';

class BillingUpgrade extends React.Component {
  render() {
    return (
      <DocumentTitle title={`Upgrade · ${this.props.organization.name}`}>
        <div className="container">
          <div className="col-12 lg-col-8 mx-auto">
            <h1 className="h1 mb4">Upgrade your Subscription</h1>

            <Panel>
              <Panel.Section>
                <strong className="mb2 block">Choose your plan</strong>

                <div className="border border-gray rounded flex">
                  <div className="p3 border-right border-gray col-6">
                    {this.renderPlan("standard", { "label": "Standard" })}
                  </div>
                  <div className="p3 col-6">
                    {this.renderPlan("enterprise", { "label": "Enterprise" })}
                  </div>
                </div>
              </Panel.Section>

              <Panel.Section>
                <FormRadioGroup
                  name="interval"
                  label="How often do you want to be billed?"
                  value={"monthly"}
                  options={[
                    { label: "Monthly", value: "monthly", help: "We'll send you an invoice once a month" },
                    { label: "Yearly", value: "yearly", help: "You'll be invoiced right away, and you won't hear from us for another year", badge: "Save 15%" }
                  ]}
                />
              </Panel.Section>

              <Panel.Section>
                <strong className="block mb2">Order summary</strong>

                <div className="border border-gray rounded p3">
                  <h3 className="h3 m0 p0 mb2 lime semi-bold">$49 per month</h3>
                  <p className="m0 p0 dark-gray mb1">This includes the <strong>Standard Plan</strong> and <strong>12</strong> additional users at $7 each.</p>
                  <p className="m0 p0 dark-gray">You’ll next invoice will be issued on the <strong>19th of July, 2017</strong></p>
                </div>
              </Panel.Section>

              <BillingCreditCardForm />

              <Panel.Footer>
                <Button loading={false} theme="success">Upgrade</Button>
              </Panel.Footer>
            </Panel>
          </div>
        </div>
      </DocumentTitle>
    );
  }

  renderPlan(id, plan) {
    return (
      <label className="flex">
        <div className="mr2">
          <input type="radio" name="upgrade[form]" value={id} />
          </div>
          <div className="flex-auto">
            <h3 className="h3 m0 p0 mb1">{plan["label"]}</h3>
            <h4 className="h4 m0 p0 mb2 dark-gray regular">$99 per month</h4>

            <ul className="list-reset m0 p0" style={{ lineHeight: "23px" }}>
              <li><strong>{123}</strong> connected agents</li>
              <li><strong>{123}</strong> included users</li>
              <li><strong>Unlimited</strong> builds</li>
              <li><strong>Customizable</strong> retention</li>
              <li>SSO</li>
              <li>Priority email + live chat support</li>
              <li>Account manager</li>
              <li>Audit logging</li>
              <li>99.95% uptime SLA</li>
              <li>Invoice payment</li>
            </ul>
          </div>
      </label>
    )
  }
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
