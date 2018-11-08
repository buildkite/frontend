import React from 'react';

import Spinner from 'app/components/shared/Spinner';

export default class Loader extends React.PureComponent {
  static displayName = "Autocomplete.Loader";

  render() {
    return (
      <li className="center py3"><Spinner /></li>
    );
  }
}
