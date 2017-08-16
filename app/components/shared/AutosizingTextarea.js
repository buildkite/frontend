import React from 'react';
import PropTypes from 'prop-types';
import autosize from 'autosize';

export default class AutosizingTextarea extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object
  };

  componentDidMount() {
    autosize(this._textarea);
  }

  componentWillUnmount() {
    autosize.destroy(this._textarea);
  }

  render() {
    const { style, ...props } = this.props;

    return (
      <textarea
        {...props}
        ref={(_textarea) => this._textarea = _textarea}
        style={{
          ...style,
          resize: 'none'
        }}
      />
    );
  }

  // In some cases the initial height can be incorrect and you need
  // to explicitly tell us to autosize the textarea for you.
  // See: http://www.jacklmoore.com/autosize/#faq-hidden
  updateAutoresize() {
    autosize.update(this._textarea);
  }

  // DOM Proxy Zone
  get value() {
    return this._textarea.value;
  }

  focus() {
    return this._textarea.focus();
  }
}
