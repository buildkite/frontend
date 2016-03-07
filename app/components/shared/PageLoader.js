import React from 'react';

class PageLoader extends React.Component {
  render() {
    return (
      <div style={{fontSize: "30px", color: "#989898", textAlign: "center", marginTop: "30px"}}>
        <i className="fa fa-spin fa-spinner"></i>
      </div>
    );
  }
}

export default PageLoader
