import React from 'react';

import Emojify from '../../shared/Emojify';

class PipelinesBanner extends React.Component {
  static propTypes = {
    id: React.PropTypes.string.isRequired,
    onHideClick: React.PropTypes.func.isRequired
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0fdc1" }}>
        <div className="container flex items-center">
          <div className="flex-auto mr4 py1" style={{ color: "#72683b" }}>
            Welcome to the new pipelines page <Emojify text=":sparkles:"/>.
            Read the <a href="/docs/basics/pipelines#pipelines-page-walkthrough" className="lime text-decoration-none hover-underline">documentation</a> to find out all about it!
          </div>
          <button className="btn px0 py4 lime text-decoration-none hover-underline" onClick={this.handleDismissClick}>Dismiss</button>
        </div>
      </div>
    );
  }

  handleDismissClick = () => {
    this.props.onHideClick(this.props.id);
  };
}

export default PipelinesBanner;
