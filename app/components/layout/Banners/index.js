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
        <div style={{marginTop: -15}} className="mb4">
          {nodes}
        </div>
      )
    } else {
      return null;
    }
  }

  handleBannerHide = (id) => {
    // Remove it from the UI right away
    let hidden = this.state.hidden;
    hidden[id] = true;
    this.setState({ hidden: hidden });

    // Also send a request to the server to remove it
    fetch("/user/banners", {
      credentials: 'same-origin',
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': window._csrf.token
      },
      body: JSON.stringify({ banner: id })
    })
  };
}

export default Banners;
