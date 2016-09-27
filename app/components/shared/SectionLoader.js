import React from 'react';

import Spinner from './Spinner';

class SectionLoader extends React.Component {
  render() {
    return (
      <div className="center my4">
        <Spinner/>
      </div>
    );
  }
}

export default SectionLoader;
