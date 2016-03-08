import React from 'react';

class Pipeline extends React.Component {
  static displayName = "Team.Pipelines.Pipeline";

  render() {
    return (
      <div>
	<strong className="text-semi-bold">{this.props.pipeline.name}</strong><br/>
	<small className="text-half-muted">{this.props.pipeline.repository}</small>
      </div>
    );
  }
}

export default Pipeline;
