import collapsible from './collapsibleFormComponent';
import labelled from './labelledFormComponent';

const textFieldDefaultProps = { type: 'text' };

const FormTextField = labelled('input');
FormTextField.defaultProps = {
  ...FormTextField.defaultProps,
  ...textFieldDefaultProps
};

FormTextField.Collapsible = collapsible('input');
FormTextField.Collapsible.defaultProps = {
  ...FormTextField.Collapsible.defaultProps,
  ...textFieldDefaultProps
};

export default FormTextField;
