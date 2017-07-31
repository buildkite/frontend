import React from 'react';
import PropTypes from 'prop-types';

import Emojify from '../../shared/Emojify';

export default class Pipeline extends React.PureComponent {
  static displayName = "Team.Pipelines.Pipeline";

  static propTypes = {
    pipeline: PropTypes.shape({
      name: PropTypes.string.isRequired,
      repository: PropTypes.shape({
        url: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <div>
        <strong className="truncate semi-bold block" title={this.props.pipeline.name}>
          <Emojify text={this.props.pipeline.name} />
        </strong>
        <small className="truncate dark-gray block" title={this.props.pipeline.repository.url}>{this.props.pipeline.repository.url}</small>
      </div>
    );
  }
}
