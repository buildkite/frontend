import React from 'react';

import Suggestion from './suggestion';

class FormAutoCompleteField extends React.Component {
  state = {
    visible: false,
    searching: false
  };

  componentWillReceiveProps(nextProps) {
    if(nextProps.items) {
      var found = false;

      if(this.state.selected) {
	// See if the currently selected value is in the list of new props
	nextProps.items.forEach((item) => {
	  if(item[1].id == this.state.selected.id) {
	    found = true;
	  };
	});
      }

      // Ah, not found! Then we should just select the first one (if there is
      // one of course)
      if(!found && nextProps.items[0]) {
	this.setState({ selected: nextProps.items[0][1] });
      }

      // We can turn off searching now since we've got some items
      if(this.state.searching) {
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
    this.refs.input.value = '';
    this.setState({ selected: null });
  }

  focus() {
    this.refs.input.focus();
  }

  render() {
    return (
      <div className="FormAutoCompleteField">
	{this._icon()}
	<input type="text"
	  ref="input"
	  onChange={this._handleInputChange.bind(this)}
	  onKeyDown={this._handleKeyDown.bind(this)}
	  onFocus={this._handleFocus.bind(this)}
	  onBlur={this._handleBlur.bind(this)}
	  placeholder={this.props.placeholder}
	  className="FormAutoCompleteField__Input" />
	{this._suggestions()}
      </div>
    );
  }

  _icon() {
    var icon = this.state.searching ? "fa-spin fa-spinner" : "fa-search";
    var iconClassName = `fa ${icon}`

    return (
      <div className="FormAutoCompleteField__Icon">
	<i className={iconClassName} />
      </div>
    );
  }

  _suggestions() {
    var style = { display: this.state.visible ? "block" : "none" };

    return (
      <div className="FormAutoCompleteField__Suggestions" ref="suggestions" style={style}>
        <ul className="FormAutoCompleteField__Suggestions__List">
          {
            this.props.items.map((item) => {
              return (
                <Suggestion
                  key={item[1].id}
                  selected={item[1] == this.state.selected}
                  suggestion={item[1]}
                  onMouseOver={this._handleSuggestionMouseOver.bind(this)}
                  onMouseDown={this._handleSuggestionMouseDown.bind(this)}>{item[0]}</Suggestion>
                );
            })
          }
        </ul>
      </div>
    );
  }

  _handleSuggestionMouseDown(suggestion) {
    this._selectItem(suggestion);
  }

  _handleSuggestionMouseOver(suggestion) {
    this.setState({ selected: suggestion });
  }

  _handleKeyDown(e) {
    // Do nothing if the list isn't visible
    if(!this.state.visible) {
      return false;
    }

    // Find the index of the currently selected item
    var index = this._indexOfItem(this.state.selected);

    // If it couldn't be found for some reason, bail
    if(index == null) {
      return false;
    }

    // If they've pressed the down key, progress to the next item in the list.
    if(e.keyCode == 40) {
      e.preventDefault();

      // If the next index doesn't exist, go back to the first
      var next = index + 1;
      if(this.props.items.length == next) {
	next = 0;
      }

      // Select the next item in the list
      this.setState({ selected: this.props.items[next][1] });

      return;
    }

    // If they've pressed the up key, progress to the next item in the list.
    if(e.keyCode == 38) {
      e.preventDefault();

      // If the previous index doesn't exist, go back to the first
      var previous = index - 1;
      if(previous == -1) {
	previous = this.props.items.length - 1;
      }

      // Select the previous item in the list
      this.setState({ selected: this.props.items[previous][1] });

      return;
    }

    // If they've hit enter, select the item
    if(e.keyCode == 13) {
      e.preventDefault();
      this._selectItem(this.state.selected);
      return;
    }

  }

  _handleFocus(e) {
    // Only re-show the list if there's something to show
    if(this.props.items && this.props.items.length > 0) {
      this.setState({ visible: true });
    }
  }

  _handleBlur(e) {
    // Hide the input in a few ms so that the user has time to click a value.
    // This could probably be done a bit better
    setTimeout(() => {
      this.setState({ visible: false });
    }, 50);
  }

  _handleInputChange(e) {
    // Get a copy of the target otherwise the event will be cleared between now
    // and when the timeout happens
    let target = e.target;

    // If a timeout is already present, clear it since the user is still typing
    if(this._timeout) {
      clearTimeout(this._timeout);
    }

    // Instead of doing a search on each keypress, do it a few ms after they've
    // stopped typing
    this._timeout = setTimeout(() => {
      this.props.onSearch(target.value);
      this.setState({ searching: true });
      delete this._timeout;
    }, 250);
  }

  _selectItem(item) {
    this.setState({ visible: false });
    this.refs.input.blur();
    this.props.onSelect(item);
  }

  _indexOfItem(search) {
    for(var i = 0; i < this.props.items.length; i++) {
      if(this.props.items[i][1].id == search.id) {
	return i;
      }
    }
  }
}

export default FormAutoCompleteField
