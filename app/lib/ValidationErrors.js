export default class ValidationErrors {
  constructor(errors) {
    this.errors = errors;
  }

  findForField(field) {
    if (this.errors && this.errors.length > 0) {
      return this.errors
        .filter((error) => error.field === field)
        .map((error) => error.message);
    }

    return [];
  }
}
