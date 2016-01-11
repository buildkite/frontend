import React from 'react';

require("../../css/NavigationDropdown.css")

class NavigationDropdown extends React.Component {
  state = {
    showing: false
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
      <ul className="NavigationDropdown__List" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
        {
          items.map((child, index) => {
            return <li key={index} className="NavigationDropdown__Item">{child}</li>
          })
        }
      </ul>
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
