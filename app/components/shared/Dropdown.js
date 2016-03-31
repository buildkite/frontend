import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Dropdown extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    width: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
    align: React.PropTypes.string,
    onToggle: React.PropTypes.func
  };

  static defaultProps = {
    nibOffset: 0
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
      let classes = classNames("absolute mt1 bg-white rounded-2 shadow border border-gray block py1 transition-popup", {
        "transition-popup-t": this.props.align == "center",
        "transition-popup-tl": this.props.align == "left",
        "transition-popup-tr": this.props.align == "right"
      });

      return (
        <div ref={c => this.popupNode = c} className={classes} style={this.popupPositionStyles()}>
          <img src={require('../../images/up-pointing-white-nib.svg')} width={32} height={20} alt="" className="pointer-events-none" style={this.nibPositionStyles()} />
          {this.popupItems()}
        </div>
      )
    }
  }

  popupPositionStyles() {
    let styles = {
      top: 35,
      width: this.props.width,
      zIndex: 3
    };

    if (this.props.align == 'right') {
      styles.right = 3;
    } else if (this.props.align == 'left') {
      styles.left = 3;
    } else if (this.props.align == 'center') {
      let center = styles.width / 2;
      styles.left = `calc(50% - ${center}px)`;
    }

    return styles;
  }

  nibPositionStyles() {
    let styles = {
      position: 'absolute',
      top: -20,
      width: 32,
      zIndex: 3
    };

    if (this.props.align == 'right') {
      styles.right = 10;
    } else if (this.props.align == 'left') {
      styles.left = 10;
    } else if (this.props.align == 'center') {
      styles.left = '50%';
      styles.marginLeft = (styles.width / 2) * -1 + this.props.nibOffset;
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
