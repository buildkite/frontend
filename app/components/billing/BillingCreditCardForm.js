import PropTypes from 'prop-types';
import React from 'react';

import FormInputLabel from '../shared/FormInputLabel';
import FormTextField from '../shared/FormTextField';
import FormSelect from '../shared/FormSelect';

import CreditCard from '../../lib/CreditCard';

class BillingCreditCardForm extends React.Component {
  static propTypes = {
    onChange: PropTypes.func,
    disabled: PropTypes.bool
  };

  state = {
    type: null
  }

  render() {
    return (
      <div>
        <div className="ml3 mt3 mr3 mb2">
          <FormTextField
            label="Name on Card"
            required={true}
            disabled={this.props.disabled}
            onChange={this.handleNameChange}
          />
        </div>

        <div className="clearfix px2">
          <div className="lg-col lg-col-7 px1 flex items-top">
            <div className="flex-auto">
              <FormTextField
                label="Card Number"
                required={true}
                disabled={this.props.disabled}
                onChange={this.handleCardNumberChange}
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
              label="CVC"
              required={true}
              disabled={this.props.disabled}
              onChange={this.handleCVCChange}
            />
          </div>
        </div>

        <div className="clearfix px2 mb2">
          <div className="lg-col lg-col-9 px1">
            <FormSelect
              label="Country"
              options={window._countries}
              required={true}
              disabled={this.props.disabled}
              onChange={this.handleCountryChange}
            />
          </div>

          <div className="lg-col lg-col-3 px1">
            <FormTextField
              label="Postal Code"
              required={true}
              disabled={this.props.disabled}
              onChange={this.handlePostCodeChange}
            />
          </div>
        </div>
      </div>
    );
  }

  renderMonthSelect() {
    return (
      <select className="select flex-auto" onChange={this.handleMonthChange} disabled={this.props.disabled}>
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
    );
  }

  renderYearSelect() {
    const year = new Date().getFullYear();

    const options = [];
    for (let yy = year; yy <= (year + 10); yy++) {
      options.push(
        <option key={yy} value={yy}>{yy - 2000}</option>
      );
    }

    return (
      <select className="select flex-auto" onChange={this.handleYearChange} disabled={this.props.disabled}>{options}</select>
    );
  }

  renderCreditCardLogo(card, title) {
    return (
      <img
        src={require(`./card-${card}.svg`)}
        alt={title}
        style={{ height: 30, width: 48, opacity: (this.state.type == card) ? 1 : 0.3 }}
        className="ml1"
      />
    );
  }

  handleNameChange = (event) => {
    this.props.onChange('name', event.target.value);
  };

  handleCardNumberChange = (event) => {
    this.setState({ type: CreditCard.calculateTypeFromNumber(event.target.value) });

    this.props.onChange('card_number', event.target.value);
  };

  handleMonthChange = (event) => {
    this.props.onChange('expiry_month', event.target.value);
  };

  handleYearChange = (event) => {
    this.props.onChange('expiry_year', event.target.value);
  };

  handleCVCChange = (event) => {
    this.props.onChange('cvc', event.target.value);
  };

  handleCountryChange = (event) => {
    this.props.onChange('address_country', event.target.value);
  };

  handlePostCodeChange = (event) => {
    this.props.onChange('address_postcode', event.target.value);
  };
}

export default BillingCreditCardForm;
