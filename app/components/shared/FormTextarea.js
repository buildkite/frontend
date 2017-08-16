import AutosizingTextarea from './AutosizingTextarea';
import labelled from './labelledFormComponent';

const FormTextarea = labelled('textarea');
FormTextarea.Autosize = labelled(AutosizingTextarea, { proxyMethods: ['updateAutoresize'] });

export default FormTextarea;
