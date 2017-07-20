import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import FormInputLabel from '../shared/FormInputLabel';
import FormTextField from '../shared/FormTextField';

class BillingCreditCardForm extends React.PureComponent {
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
                <select className="select flex-auto"></select>
                <div className="dark-gray bold center" style={{ width: 50 }}>/</div>
                <select className="select flex-auto"></select>
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
            <FormTextField
              label="Country"
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
