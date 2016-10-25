import React from 'react';
import classNames from 'classnames';

class PipelinesBanner extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    onHideClick: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        Tell me more!
        <button className="btn px4 py3" onClick={this.handleCloseClick}>Close</button>
      </div>
    );
  }

  handleCloseClick = () => {
    this.props.onHideClick(this.props.id);
  };
}

export default PipelinesBanner;
