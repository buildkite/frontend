import React from 'react';

class NavigationDropdown extends React.Component {
  state = {
    showing: true
  };

  render() {
    return (
      <div className={this.props.className}>
        <div onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
          {this.props.children[0]}
        </div>
        <div className="ml1">
          &#9662;
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
      <div className="absolute bg-white rounded shadow border" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)} style={{zIndex: 10}}>
        {items}
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
