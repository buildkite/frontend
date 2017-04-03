import React from 'react';
import classNames from 'classnames';

import SearchField from '../SearchField';
import Suggestion from './suggestion';
import ErrorMessage from './error-message';

class AutocompleteField extends React.PureComponent {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    onSearch: React.PropTypes.func.isRequired,
    placeholder: React.PropTypes.string,
    items: React.PropTypes.array
  };

  state = {
    visible: false,
    searching: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.items) {
      let found = false;

      if (this.state.selected) {
        // See if the currently selected value is in the list of new props, but
        // making sure to skip error message components, since they have no
        // item id.
        nextProps.items.forEach((item) => {
          if (!this.isErrorMessageComponent(item) && item[1].id === this.state.selected.id) {
            found = true;
          }
        });
      }

      // Ah, not found! Then we should just select the first one (if there is
      // one of course)
      if (!found && nextProps.items[0]) {
        this.setState({ selected: nextProps.items[0][1] });
      }

      // We can turn off searching now since we've got some items
      if (this.state.searching) {
        this.setState({ searching: false });
      }

      // And finally, if we got data, then we should make the list
      // visible
      this.setState({ visible: (nextProps.items.length > 0) });
    } else {
      this.setState({ selected: null });
    }
  }

  clear() {
    this._searchField.clear();
  }

  focus() {
    this._searchField.focus();
  }

  selectItem(item) {
    this.setState({ visible: false });
    this._searchField.blur();
    this.props.onSelect(item);
  }

  isErrorMessageComponent(node) {
    return node && node.type && node.type.displayName === "AutocompleteField.ErrorMessage";
  }

  render() {
    return (
      <div className="relative">
        <SearchField
          ref={(_searchField) => this._searchField = _searchField}
          onChange={this.handleSearchChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder}
          searching={this.state.searching}
        />
        {this.renderSuggestions()}
      </div>
    );
  }

  renderSuggestions() {
    const style = {
      display: this.state.visible ? "block" : "none",
      marginTop: 3,
      zIndex: 999,
      width: "100%",
      lineHeight: 1.4
    };

    const items = this.props.items;
    const suggestions = items.map((item, index) => {
      if (this.isErrorMessageComponent(item)) {
        return (
          <div key={index}>
            {item}
          </div>
        );
      } else {
        const isSelected = item[1] && this.state.selected && (item[1].id === this.state.selected.id);

        // `selected` needs to always return a boolean as it's a requirement of
        // the Suggestion component
        return (
          <Suggestion
            key={index}
            className={classNames({
              "rounded": items.length === 1,
              "rounded-top": (items.length > 1 && index === 0),
              "rounded-bottom": (index > 0 && index === (items.length - 1))
            })}
            selected={!!isSelected}
            suggestion={item[1]}
            onMouseOver={this.handleSuggestionMouseOver}
            onMouseDown={this.handleSuggestionMouseDown}
          >{item[0]}</Suggestion>
        );
      }
    });

    return (
      <div className="bg-white border border-silver rounded shadow absolute" style={style}>
        <ul className="list-reset m0 p0">{suggestions}</ul>
      </div>
    );
  }

  handleSuggestionMouseDown = (suggestion) => {
    this.selectItem(suggestion);
  };

  handleSuggestionMouseOver = (suggestion) => {
    this.setState({ selected: suggestion });
  };

  handleKeyDown = (evt) => {
    // Do nothing if the list isn't visible
    if (!this.state.visible) {
      return false;
    }

    // Find the index of the currently selected item
    let index;
    for (let itemIndex = 0; itemIndex < this.props.items.length; itemIndex++) {
      const item = this.props.items[itemIndex];

      // Ensure we skip error message nodes since they have no associated
      // suggestion data
      if (this.isErrorMessageComponent(item)) {
        continue;
      }

      if (item[1].id === this.state.selected.id) {
        index = itemIndex;
        break;
      }
    }

    // If it couldn't be found for some reason, bail
    if (index == null) {
      return false;
    }

    // If they've pressed the down key, progress to the next item in the list.
    if (evt.keyCode === 40) {
      evt.preventDefault();

      // If the next index doesn't exist, go back to the first
      let next = index + 1;
      if (this.props.items.length === next) {
        next = 0;
      }

      // Select the next item in the list
      this.setState({ selected: this.props.items[next][1] });

      return;
    }

    // If they've pressed the up key, progress to the next item in the list.
    if (evt.keyCode === 38) {
      evt.preventDefault();

      // If the previous index doesn't exist, go back to the first
      let previous = index - 1;
      if (previous === -1) {
        previous = this.props.items.length - 1;
      }

      // Select the previous item in the list
      this.setState({ selected: this.props.items[previous][1] });

      return;
    }

    // If they've hit enter, select the item
    if (evt.keyCode === 13) {
      evt.preventDefault();
      this.selectItem(this.state.selected);
      return;
    }
  };

  handleFocus = () => {
    // Only re-show the list if there's something to show
    if (this.props.items && this.props.items.length > 0) {
      this.setState({ visible: true });
    }
  };

  handleBlur = () => {
    // Hide the input in a few ms so that the user has time to click a value.
    // This could probably be done a bit better
    setTimeout(() => {
      this.setState({ visible: false });
    }, 50);
  };

  handleSearchChange = (value) => {
    this.props.onSearch(value);
    this.setState({ searching: true });
  };
}

AutocompleteField.ErrorMessage = ErrorMessage;

export default AutocompleteField;
