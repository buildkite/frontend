import AutosizingTextarea from './AutosizingTextarea';
import collapsible from './collapsibleFormComponent';
import labelled from './labelledFormComponent';

const FormTextarea = labelled('textarea');
FormTextarea.Autosize = labelled(AutosizingTextarea);
FormTextarea.Autosize.proxyMethods = ['updateAutoresize'];

FormTextarea.Collapsible = collapsible('textarea');
FormTextarea.Collapsible.Autosize = collapsible(AutosizingTextarea);
FormTextarea.Collapsible.Autosize.proxyMethods = ['updateAutoresize'];

export default FormTextarea;
