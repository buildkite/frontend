import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Dropdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    topOffset: React.PropTypes.number,
    width: React.PropTypes.any,
    onToggle: React.PropTypes.any
  };

  state = {
    showing: false
  };

  componentDidMount() {
    document.documentElement.addEventListener('click', this.handleDocumentClick, false);
    document.documentElement.addEventListener('keydown', this.handleDocumentKeyDown, false);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.handleDocumentClick);
    document.documentElement.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  render() {
    return (
      <span ref={c => this.rootNode = c} className={classNames("relative", this.props.className)}>
        {this.props.children[0]}
        <ReactCSSTransitionGroup transitionName="transition-popup" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
          {this.renderPopupNode()}
        </ReactCSSTransitionGroup>
      </span>
    )
  }

  renderPopupNode() {
    if (this.state.showing) {
      return (
        <div ref={c => this.popupNode = c} className={this.popupClassName()} style={this.popupStyles()} key="popup">
          <img src={require('./Dropdown/nib.svg')} width={32} height={20} alt="" className="pointer-events-none" style={this.nibStyles()} />
          {this.popupItems()}
        </div>
      )
    }
  }

  popupClassName() {
    return classNames("absolute mt1 bg-white rounded-2 shadow border block transition-popup", {
      "transition-popup-tr": this.props.align == "right",
      "transition-popup-tl": this.props.align != "right"
    })
  }

  popupStyles() {
    let styles = {
      top: 'calc(3.5rem + ' + (this.props.topOffset || 0) + 'px)',
      width: this.props.width || 'auto',
      zIndex: 3
    };

    if (this.props.align == 'right') {
      styles.right = '.25rem';
    } else {
      styles.left = '.25rem';
    }

    return styles;
  }

  nibStyles() {
    let styles = {
      position: 'absolute',
      top: -20,
      width: 32,
      zIndex: 3
    };

    if (this.props.align == 'right') {
      styles.right = 10;
    } else {
      styles.left = 10;
    }

    return styles;
  }

  popupItems() {
    // Flatten all arrays of arrays
    return [].concat.apply([], this.props.children.slice(1));
  }

  handleDocumentClick = (event) => {
    const target = event.target;

    const clickWasInComponent = this.rootNode.contains(target)

    // We don't have a ref to the popup button, so to detect a click on the
    // button we detect that it "wasn't" in the popup node, leaving only the
    // button that it could have been in
    const buttonWasClicked = clickWasInComponent && (!this.popupNode || !this.popupNode.contains(target));

    if (buttonWasClicked) {
      this.setShowing(!this.state.showing);
    } else if (this.state.showing && !clickWasInComponent) {
      this.setShowing(false);
    }
  };

  handleDocumentKeyDown = (event) => {
    // Handle the escape key
    if (this.state.showing && event.keyCode == 27) {
      this.setShowing(false);
    }
  };

  setShowing(showing) {
    this.setState({ showing: showing });

    if (this.props.onToggle) {
      this.props.onToggle(this.state.showing);
    }
  }
}

export default Dropdown;
