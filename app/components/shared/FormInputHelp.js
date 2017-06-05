import React from 'react';
import PropTypes from 'prop-types';

export default class FormInputHelp extends React.PureComponent {
  static propTypes = {
    html: PropTypes.string.isRequired
  };

  render() {
    return (
      <p className="mt1 mb0 p0 dark-gray" dangerouslySetInnerHTML={{ __html: this.props.html }} />
    );
  }
}
