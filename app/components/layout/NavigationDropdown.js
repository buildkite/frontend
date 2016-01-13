import React from 'react';
import domAlign from 'dom-align';

class NavigationDropdown extends React.Component {
  state = {
    showing: false
  };

  render() {
    return (
      <div className={this.props.className}>
        <div ref="label" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
          {this.props.children[0]}
        </div>
        <div className="ml1">
          &#9662;
        </div>
        {this._dropdownListNode()}
      </div>
    )
  }

  componentDidMount() {
    this._alignElements()
  }

  componentDidUpdate() {
    this._alignElements()
  }

  _dropdownListNode() {
    // We toggle the display of the dropdown using block/none instead of just
    // not rendering the DOM because we need it in place so we can align it
    // correctly to the label element.
    var style = {
      display: this.state.showing ? 'block' : 'none',
      zIndex: 10
    }

    // Flatten all arrays in arrays
    var items = [].concat.apply([], this.props.children.slice(1));

    return (
      <div ref="dropdown" className="absolute" onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)} style={style}>
        <div className="mt1 bg-white rounded shadow border">
          {items}
        </div>
      </div>
    );
  }

  _alignElements() {
    var points = this.props.align == "right" ? [ "tr", "br" ] : [ "tl", "bl" ];

    domAlign(this.refs.dropdown, this.refs.label, { points: points });
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
