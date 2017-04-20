import React from 'react';

export default class Pipeline extends React.PureComponent {
  static displayName = "Team.Pipelines.Pipeline";

  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      repository: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <div>
        <strong className="truncate semi-bold block" title={this.props.pipeline.name}>{this.props.pipeline.name}</strong>
        <small className="truncate dark-gray block" title={this.props.pipeline.repository.url}>{this.props.pipeline.repository.url}</small>
      </div>
    );
  }
}
