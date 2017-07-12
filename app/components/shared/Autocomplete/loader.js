import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Spinner from '../../shared/Spinner';

export default class Loader extends React.PureComponent {
  static displayName = "Autocomplete.Loader";

  render() {
    return (
      <li className="center py3"><Spinner /></li>
    );
  }
}
