import React from 'react';

import PipelinesBanner from './pipelines';

class Banners extends React.Component {
  state = {
    hidden: {}
  };

  render() {
    let nodes = [];
    if(window._banners) {
      for(const id of window._banners) {
        if(!this.state.hidden[id]) {
          nodes.push(<PipelinesBanner id={id} key={id} onHideClick={this.handleBannerHide} />);
        }
      }
    }

    if(nodes.length) {
      return (
        <div className="container mb4">
          {nodes}
        </div>
      )
    } else {
      return null;
    }
  }

  handleBannerHide = (id) => {
    let hidden = this.state.hidden;
    hidden[id] = true;

    this.setState({ hidden: hidden });
  };
}

export default Banners;
