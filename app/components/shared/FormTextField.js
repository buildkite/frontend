import labelled from './labelledFormComponent';

const FormTextField = labelled(
  'input',
  {
    defaultProps: {
      type: 'text'
    }
  }
);

export default FormTextField;
