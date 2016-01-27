import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class Dropdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    topOffset: React.PropTypes.number,
    width: React.PropTypes.any
  };

  state = {
    showing: false
  };

  componentDidMount() {
    document.documentElement.addEventListener('click', this.handleDocumentClick, false)
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.handleDocumentClick)
  }

  render() {
    return (
      <span ref={c => this.rootNode = c} className={classNames("relative", this.props.className)}>
        {this.props.children[0]}
        <div ref={c => this.popupNode = c} className={classNames("absolute mt1 bg-white rounded shadow border", this.transitionPopupClassNames())} style={this.popupStyles()}>
          {this.popupItems()}
        </div>
      </span>
    )
  }

  popupStyles() {
    let styles = {
      top: 'calc(3.5rem + ' + (this.props.topOffset || 0) + 'px)',
      width: this.props.width || 'auto',
      zIndex: 3
    };

    if (this.props.align == 'right') {
      styles.right = 0;
    } else {
      styles.left = 0;
    }

    return styles;
  }

  transitionPopupClassNames() {
    return classNames(
      this.state.showing ? 'transition-popup-shown' : 'transition-popup-hidden',
      this.props.align == 'right' ? 'transition-popup-tr' : 'transition-popup-tl'
    )
  }

  popupItems() {
    // Flatten all arrays of arrays
    return [].concat.apply([], this.props.children.slice(1));
  }

  handleDocumentClick = (event) => {
    const target = event.target;

    // Handle clicks on the button
    if (this.rootNode.contains(target) && target != this.popupNode && !this.popupNode.contains(target)) {
      this.setState({ showing: !this.state.showing });
    // Handle clicks outside the popup
    } else if (!this.popupNode.contains(target) && this.state.showing) {
      this.setState({ showing: false });
    }
  };
}

export default Dropdown;
