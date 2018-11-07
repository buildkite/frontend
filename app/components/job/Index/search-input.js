import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'app/components/shared/Icon';

export default class SearchInput extends React.PureComponent {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    return (
      <div className="relative flex flex-auto">
        <Icon
          icon="search"
          className="gray absolute"
          style={{ width: 15, height: 15, left: 8, top: 11 }}
        />

        <input
          type="text"
          className="input"
          style={{ paddingLeft: 28 }}
          onChange={this.handleInputChange}
          onKeyUp={this.handleInputKeyUp}
          value={this.props.value}
          placeholder="Search by agent query rules…"
          spellCheck={false}
        />
      </div>
    );
  }

  handleInputChange = (event) => {
    this.props.onChange(event);
  }
}
