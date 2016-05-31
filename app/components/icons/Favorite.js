import React from 'react';

class Favorite extends React.Component {
  static propTypes = {
    favorite: React.PropTypes.bool.isRequired
  };

  state = {
    hover: false
  };

  componentWillReceiveProps(nextProps) {
    if(this.props.favorite != nextProps.favorite && this.state.hover) {
      this.setState({ hover: false });
    }
  }

  render() {
    return (
      <svg width="20px" height="15px" viewBox="0 0 16 15" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
        <title>Favorite</title>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" fillOpacity="0.3">
          <g transform="translate(-1157.000000, -134.000000)" stroke={this.props.favorite || this.state.hover ? "#F8CC1C" : "#DDDDDD"} fill={this.props.favorite && !this.state.hover ? "#F8CC1C" : ""}>
            <g transform="translate(54.000000, 115.000000)">
              <polygon points="1111 31 1106.29772 33.472136 1107.19577 28.236068 1103.39155 24.527864 1108.64886 23.763932 1111 19 1113.35114 23.763932 1118.60845 24.527864 1114.80423 28.236068 1115.70228 33.472136"></polygon>
            </g>
          </g>
        </g>
      </svg>
    );
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  };

  handleMouseOut = () => {
    this.setState({ hover: false });
  };
}

export default Favorite
