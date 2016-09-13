import React from 'react';

class FormInputHelp extends React.Component {
  static propTypes = {
    html: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <p className="mt1 mb0 p0 dark-gray" dangerouslySetInnerHTML={{ __html: this.props.html }} />
    );
  }
}

export default FormInputHelp;
