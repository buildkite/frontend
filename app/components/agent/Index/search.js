import React from 'react';
import throttleit from 'throttleit';

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

    const delay = props.delayed ? 250 : 1;
    this.handleKeyUpThrottled = throttleit(() => { this.handleKeyUp(); }, delay);
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
