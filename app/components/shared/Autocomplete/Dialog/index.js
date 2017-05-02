import React from 'react';

import Dialog from '../../Dialog';
import SearchField from '../../SearchField';
import Suggestion from './suggestion';
import ErrorMessage from '../error-message';

class AutocompleteDialog extends React.PureComponent {
  static propTypes = {
    isOpen: React.PropTypes.bool.isRequired,
    onRequestClose: React.PropTypes.func.isRequired,
    width: React.PropTypes.number,
    onSelect: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    selectLabel: React.PropTypes.string,
    items: React.PropTypes.array
  };

  state = {
    searching: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.items && this.state.searching) {
      // We can turn off searching now since we've got some items
      this.setState({ searching: false });
    }
  }

  clear() {
    this._searchField.clear();
  }

  focus() {
    this._searchField.focus();
  }

  selectItem(item) {
    this._searchField.blur();
    this.props.onSelect(item);
    this.props.onRequestClose();
  }

  isErrorMessageComponent(node) {
    return node && node.type && node.type.displayName === ErrorMessage.displayName;
  }

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        width={this.props.width}
      >
        <div className="px4 pt4 pb3">
          <SearchField
            ref={(_searchField) => this._searchField = _searchField}
            onChange={this.handleSearchChange}
            onKeyDown={this.handleKeyDown}
            placeholder={this.props.placeholder}
            searching={this.state.searching}
          />
        </div>
        <hr className="m0 bg-gray border-none height-0" style={{ height: 1 }} />
        {this.renderSuggestions()}
      </Dialog>
    );
  }

  renderSuggestions() {
    const items = this.props.items;

    // Insert a seperator between each section
    const suggestions = [];
    let key = 0;
    for (let index = 0, length = items.length; index < length; index++) {
      if (this.isErrorMessageComponent(items[index])) {
        suggestions.push(
          <div key={key += 1} className="px3 py2 center">
            {items[index]}
          </div>
        );
      } else {
        suggestions.push(
          <Suggestion
            key={key += 1}
            className="rounded"
            suggestion={items[index][1]}
            onSelect={this.handleSuggestionSelection}
            selectLabel={this.props.selectLabel}
          >
            {items[index][0]}
          </Suggestion>
        );

        suggestions.push(<hr key={key += 1} className="p0 m0 bg-gray" style={{ border: "none", height: 1 }} />);
      }
    }

    return (
      <div className="block" style={{ width: "100%", minHeight: 300 }}>
        <ul className="list-reset m0 p0">
          {suggestions}
        </ul>
      </div>
    );
  }

  handleSuggestionSelection = (suggestion) => {
    this.selectItem(suggestion);
  };

  handleSearchChange = (value) => {
    this.props.onSearch(value);
    this.setState({ searching: true });
  };
}

AutocompleteDialog.ErrorMessage = ErrorMessage;

export default AutocompleteDialog;
