import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import FormInputLabel from '../shared/FormInputLabel';
import FormTextField from '../shared/FormTextField';
import FormSelect from '../shared/FormSelect';

class BillingCreditCardForm extends React.Component {
  render() {
    return (
      <div>
        <div className="ml3 mt3 mr3 mb2">
          <FormTextField
            label="Name on Card"
            required={true}
          />
        </div>

        <div className="clearfix px2">
          <div className="lg-col lg-col-7 px1 flex items-top">
            <div className="flex-auto">
              <FormTextField
                label="Card Number"
                required={true}
              />
            </div>

            <div style={{ marginTop: 27 }} className="ml1">
              {this.renderCreditCardLogo("visa", "VISA")}
              {this.renderCreditCardLogo("mastercard", "MasterCard")}
              {this.renderCreditCardLogo("amex", "American Express")}
            </div>
          </div>

          <div className="lg-col lg-col-3 px1">
            <div className="mb2">
              <FormInputLabel label="Expiration" required={true} />

              <div className="flex items-center">
                {this.renderMonthSelect()}
                <div className="dark-gray bold center" style={{ width: 50 }}>/</div>
                {this.renderYearSelect()}
              </div>
            </div>
          </div>

          <div className="lg-col lg-col-2 px1">
            <FormTextField
              label="CVV"
              required={true}
            />
          </div>
        </div>

        <div className="clearfix px2 mb2">
          <div className="lg-col lg-col-9 px1">
            <FormSelect
              label="Country"
              options={window._countries}
              required={true}
            />
          </div>

          <div className="lg-col lg-col-3 px1">
            <FormTextField
              label="Postal Code"
              required={true}
            />
          </div>
        </div>
      </div>
    );
  }

  renderMonthSelect() {
    return (
      <select className="select flex-auto">
        <option value="1">01</option>
        <option value="2">02</option>
        <option value="3">03</option>
        <option value="4">04</option>
        <option value="5">05</option>
        <option value="6">06</option>
        <option value="7">07</option>
        <option value="8">08</option>
        <option value="9">09</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
    )
  }

  renderYearSelect() {
    let year = new Date().getFullYear();

    let options = [];
    for(let y = year; y <= (year + 10); y++) {
      options.push(
        <option idx={y} value={y}>{y - 2000}</option>
      )
    }

    return (
      <select className="select flex-auto">{options}</select>
    )
  }

  renderCreditCardLogo(card, title) {
    return (
      <img
        src={require(`./card-${card}.svg`)}
        alt={title}
        style={{ height: 30, width: 48, opacity: 0.3 }}
        className="ml1"
      />
    )
  }
}

export default BillingCreditCardForm;
