import React from 'react';

class Pipeline extends React.Component {
  render() {
    return (
      <div>{this.props.pipeline.name}</div>
    );
  }
}

export default Pipeline
