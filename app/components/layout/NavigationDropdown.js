import React from 'react';

require("../../css/NavigationDropdown.css")

class NavigationDropdown extends React.Component {
  state = {
    showing: true
  };

  render() {
    return (
      <div className="NavigationDropdown">
        <div className="NavigationDropdown__Label" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
          {this.props.children[0]}
          <i className="NavigationDropdown__Caret fa fa-caret-down" />
        </div>

        {this._dropdownListNode()}
      </div>
    )
  }

  _dropdownListNode() {
    if(!this.state.showing) {
      return null;
    }

    // Flatten all arrays in arrays
    var items = [].concat.apply([], this.props.children.slice(1));

    return (
      <div className="bg-white rounded shadow" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)} style={{position: "absolute", zIndex: 10}}>
        {
          items.map((child, index) => {
            return <div key={index}>{child}</div>
          })
        }
      </div>
    );
  }

  _onMouseOver(e) {
    if(this._timeout) {
      clearTimeout(this._timeout);
    }

    this.setState({ showing: true });
  }

  _onMouseOut(e) {
    this._timeout = setTimeout(() => {
      this.setState({ showing: false });
      delete this._timeout
    }, 100);
  }
};

export default NavigationDropdown;
