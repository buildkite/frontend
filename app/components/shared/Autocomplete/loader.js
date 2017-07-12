import React from 'react';

import Spinner from '../../shared/Spinner';

export default class Loader extends React.PureComponent {
  static displayName = "Autocomplete.Loader";

  render() {
    return (
      <li className="center py3"><Spinner /></li>
    );
  }
}
