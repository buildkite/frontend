class ValidationErrors {
  constructor(errors) {
    this.errors = errors;
  }

  findForField(field) {
    if (this.errors && this.errors.length > 0) {
      const messages = [];

      this.errors.forEach((error) => {
        if (error.field === field) {
          messages.push(error.message);
        }
      });

      return messages;
    } else {
      return null;
    }
  }
}

export default ValidationErrors;
