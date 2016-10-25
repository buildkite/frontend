import React from 'react';

import PipelinesBanner from './pipelines';

class Banners extends React.Component {
  render() {
    return (
      <div className="container mb4">
        <PipelinesBanner id="pipelines" onHideClick={this.handleBannerHide} />
      </div>
    )
  }

  handleBannerHide = (id) => {
    console.log('removing ', id);
  };
}

export default Banners;
