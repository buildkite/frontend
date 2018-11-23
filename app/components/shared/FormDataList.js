import React from 'react';
import PropTypes from 'prop-types';

class FormDataList extends React.PureComponent {
  static propTypes = {
    id: PropTypes.node.isRequired,
    values: PropTypes.arrayOf(PropTypes.string.isRequired)
  };

  render() {
    return (
      <datalist id={this.props.id}>
        {this.props.values.map((value) => <option key={value} value={value} />)}
      </datalist>
    );
  }
}

export default FormDataList;
