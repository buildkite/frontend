import React from 'react';
import throttle from 'throttleit';

class Search extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    style: React.PropTypes.object,
    onSearch: React.PropTypes.func,
    delayed: React.PropTypes.bool
  };

  constructor(props) {
    super();

    if (props.delayed) {
      this.handleKeyUpThrottled = throttle(() => { this.handleKeyUp(); }, 250);
    } else {
      this.handleKeyUpThrottled = this.handleKeyUp;
    }
  }

  render() {
    return (
      <input
        ref={(input) => this.input = input}
        type="text"
        className={this.props.className}
        placeholder={this.props.placeholder}
        style={this.props.style}
        onKeyUp={this.handleKeyUpThrottled}
      />
    );
  }

  handleKeyUp = () => {
    if (this._value !== this.input.value && this.props.onSearch) {
      this._value = this.input.value;
      this.props.onSearch(this.input.value);
    }
  };
}

export default Search;
