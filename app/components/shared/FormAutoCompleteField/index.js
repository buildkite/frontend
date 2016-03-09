import React from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

import Suggestion from './suggestion';

class FormAutoCompleteField extends React.Component {
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
    if(nextProps.items) {
      var found = false;

      if(this.state.selected) {
        // See if the currently selected value is in the list of new props
        nextProps.items.forEach((item) => {
          if(item[1].id == this.state.selected.id) {
            found = true;
          }
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
    this._inputNode.value = '';
    this.setState({ selected: null });
  }

  focus() {
    this._inputNode.focus();
  }

  selectItem(item) {
    this.setState({ visible: false });
    this._inputNode.blur();
    this.props.onSelect(item);
  }

  render() {
    return (
      <div className="relative">
        {this.renderIcon()}
        <input type="input"
          className="input"
          ref={c => this._inputNode = c}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          placeholder={this.props.placeholder} />
        {this.renderSuggestions()}
      </div>
    );
  }

  renderIcon() {
    if(this.state.searching) {
      return (
        <div className="absolute" style={{right: 7, top: 6}}>
          <Icon icon="spinner" className="dark-gray animation-spin" style={{width: 18, height: 18}} />
        </div>
      );
    } else {
      return (
        <div className="absolute" style={{right: 7, top: 6}}>
          <Icon icon="search" className="dark-gray" style={{width: 17, height: 17}} />
        </div>
      );
    }
  }

  renderSuggestions() {
    let style = {
      display: this.state.visible ? "block" : "none",
      marginTop: 3,
      zIndex: 999,
      width: "100%",
      lineHeight: 1.4
    };

    let items = this.props.items;

    return (
      <div className="bg-white border border-silver rounded shadow absolute" style={style}>
        <ul className="list-reset m0 p0">
          {
            items.map((item, index) => {
              return (
                <Suggestion
                  key={item[1].id}
                  className={classNames({
                    "rounded-top": (index == 0),
                    "rounded-bottom": (index == (items.length - 1))
                  })}
                  selected={item[1] == this.state.selected}
                  suggestion={item[1]}
                  onMouseOver={this.handleSuggestionMouseOver}
                  onMouseDown={this.handleSuggestionMouseDown}>{item[0]}</Suggestion>
                );
            })
          }
        </ul>
      </div>
    );
  }

  handleSuggestionMouseDown = (suggestion) => {
    this.selectItem(suggestion);
  };

  handleSuggestionMouseOver = (suggestion) => {
    this.setState({ selected: suggestion });
  };

  handleKeyDown = (e) => {
    // Do nothing if the list isn't visible
    if(!this.state.visible) {
      return false;
    }

    // Find the index of the currently selected item
    let index;
    for(var i = 0; i < this.props.items.length; i++) {
      if(this.props.items[i][1].id == this.state.selected.id) {
        index = i;
        break
      }
    }

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
      this.selectItem(this.state.selected);
      return;
    }
  };

  handleFocus = () => {
    // Only re-show the list if there's something to show
    if(this.props.items && this.props.items.length > 0) {
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

  handleInputChange = (e) => {
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
  };
}

export default FormAutoCompleteField
