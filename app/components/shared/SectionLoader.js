import React from 'react';

import Spinner from './Spinner';

export default class SectionLoader extends React.PureComponent {
  render() {
    return (
      <div className="center my4">
        <Spinner />
      </div>
    );
  }
}
