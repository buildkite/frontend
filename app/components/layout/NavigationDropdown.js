import React from 'react';
import ReactDOM from "react-dom";
import domAlign from 'dom-align';

class NavigationDropdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    width: React.PropTypes.any
  };

  state = {
    showing: false
  };

  render() {
    return (
      <div ref={c => this.labelNode = c} className={this.props.className} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <div>
          {this.props.children[0]}
        </div>
        <div className="ml1">
          &#9662;
        </div>
        {this.dropdownListNode()}
      </div>
    )
  }

  componentDidMount() {
    this.alignElements()
  }

  componentDidUpdate() {
    this.alignElements()
  }

  dropdownListNode() {
    // Flatten all arrays in arrays
    var items = [].concat.apply([], this.props.children.slice(1));

    return (
      <div ref={c => this.dropdownNode = c} className="absolute" style={{zIndex: 10, width: this.props.width || 'auto'}}>
        <div className="mt1 bg-white rounded shadow border" style={{display: this.state.showing ? 'block' : 'none'}}  onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
          {items}
        </div>
      </div>
    );
  }

  alignElements() {
    // Don't bother about aligning the elements if we're not showing the
    // dropdown.
    if(!this.state.showing) {
      return;
    }

    var points = this.props.align == "right" ? [ "tr", "br" ] : [ "tl", "bl" ];
    domAlign(ReactDOM.findDOMNode(this.dropdownNode), ReactDOM.findDOMNode(this.labelNode), { points: points });
  }

  handleMouseOver = () => {
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
  };

  handleMouseOut = () => {
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
  };
}

export default NavigationDropdown;
