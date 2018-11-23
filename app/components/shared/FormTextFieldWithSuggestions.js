import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import FormTextField from './FormTextField';
import Icon from 'app/components/shared/Icon';

type Props = {
};

type State = {
  visible: boolean,
  rendered: boolean,
  selected: null
};

const BORDER_COLOR = "#888";

class FormTextFieldWithSuggestions extends React.Component<Props, State> {
  state = {
    visible: false,
    rendered: false,
    selected: "HEAD"
  };

  render() {
    let textFieldStyle;
    if (this.state.visible) {
      textFieldStyle = {
        borderColor: BORDER_COLOR
      };
    }

    return (
      <div className="relative">
        <Icon icon="down-triangle" className="absolute" style={{ width: 7, height: 7, right: 15, top: 38 }} />
        <FormTextField
          {...this.props} ref={(tf) => this.textField = tf}
          autoComplete="off"
          style={textFieldStyle}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {this.renderSuggestions()}
      </div>
    );
  }

  renderSuggestions() {
    const classes = classNames("absolute bg-white border border-gray shadow-subtle rounded", {
      "hidden": this.state.visible == false
    });

    return (
      <div
        className={classes}
        style={{
          zIndex: 300,
          width: "100%",
          // borderColor: BORDER_COLOR,
          marginTop: -6,
          color: "555555"
        }}
      >
        {this.props.suggestions.map((suggestion) => {
          return (
            <div
              className="cursor-pointer"
              key={suggestion.value}
              style={{padding: ".43em .86em", lineHeight: 1.42857143}}
              onClick={() => { this.handleSuggestionClick(suggestion.value) }}
            >
              {suggestion.component(this.state.selected == suggestion.value)}
            </div>
          )
        })}
      </div>
    )
  }

  handleSuggestionClick = (value) => {
    this.textField.value = value;
    this.hide();
  }

  handleFocus = () => {
    this.setState({ visible: true });
  }

  handleBlur = () => {
    // Just enough time for the browsers click event to happen on the
    // suggestion (before we get rid of it)
    setTimeout(() => {
      this.hide();
    }, 150);
  }

  hide() {
    this.setState({ visible: false });
  }

  get value() {
    return this.textField.value;
  }

  focus() {
    this.textField.focus();
  }
}

export default FormTextFieldWithSuggestions
