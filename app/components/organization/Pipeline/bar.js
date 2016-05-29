import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

class Bar extends React.Component {
  static propTypes = {
    color: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.string.isRequired,
    left: React.PropTypes.number.isRequired
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    let style = {
      backgroundColor: this.props.color,
      width: this.props.width,
      bottom: 0,
      left: this.props.left,
      height: this.props.height
    };

    return (
      <div className="border-box inline-block absolute bottom" style={style} />
    );
  };
}

export default Bar
