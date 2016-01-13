import React from 'react';
import ReactDOM from 'react-dom';
import domAlign from 'dom-align';

class NavigationDropdown extends React.Component {
  state = {
    showing: false
  };

  render() {
    return (
      <div ref="label" className={this.props.className} onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
        <div>
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
    // Flatten all arrays in arrays
    var items = [].concat.apply([], this.props.children.slice(1));

    return (
      <div ref="dropdown" className="absolute" style={{zIndex: 10, width: this.props.width || 'auto'}}>
        <div className="mt1 bg-white rounded shadow border" style={{display: this.state.showing ? 'block' : 'none'}}  onMouseOver={this._onMouseOver.bind(this)} onMouseOut={this._onMouseOut.bind(this)}>
          {items}
        </div>
      </div>
    );
  }

  _alignElements() {
    // Don't bother about aligning the elements if we're not showing the
    // dropdown.
    if(!this.state.showing) {
      return;
    }

    var points = this.props.align == "right" ? [ "tr", "br" ] : [ "tl", "bl" ];
    domAlign(this.refs.dropdown, this.refs.label, { points: points });
  }

  _onMouseOver(e) {
    // If there's a timeout (meaning the cursor has just moved out of the label
    // and onto the dropdown) then we'll just clear that timeout, so it won't
    // try and hide the dropdown.
    if(this._timeout) {
      clearTimeout(this._timeout);
      delete this._timeout
    }

    // Small optimization, don't bother re-setting the state if we're already
    // showing the dropdown.
    if(this.state.showing) {
      return;
    }

    this.setState({ showing: true });
  }

  _onMouseOut(e) {
    // Remove any existing timeout (so we don't have multiple timeouts running
    // at once)
    if(this._timeout) {
      clearTimeout(this._timeout);
      delete this._timeout
    }

    // We set a timeout to give the cursor time to get from the label to the
    // dropdown. If we did a 'mouseOut' on just the label, the moment the
    // cursor left it for the dropdown, we'd hide the list.
    this._timeout = setTimeout(() => {
      this.setState({ showing: false });
      delete this._timeout
    }, 100);
  }
};

export default NavigationDropdown;
