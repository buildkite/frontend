import React from 'react';

class Pipeline extends React.Component {
  render() {
    return (
      <div className="border border-gray rounded mb2 p2">
        {this.props.pipeline.name}
      </div>
    );
  }
}

export default Pipeline
