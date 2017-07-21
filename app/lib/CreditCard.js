const VISA_REGEXP = new RegExp("^4");
const AMEX_REGEXP = new RegExp("^3[47]");
const MASTERCARD_REGEXP = new RegExp("^5[1-5]");

class CreditCard {
  constructor() {
  }

  static calculateTypeFromNumber(number) {
    console.log(number);
    if (number) {
      if (number.match(VISA_REGEXP)) {
        return "visa";
      }

      if (number.match(AMEX_REGEXP)) {
        return "amex";
      }

      if (number.match(MASTERCARD_REGEXP)) {
        return "mastercard";
      }
    }

    // If we've gotten this far, no match friend...
    return null;
  }
}

export default CreditCard;
