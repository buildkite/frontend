import React from 'react';
import PropTypes from 'prop-types';

import parseEmoji from '../../lib/parseEmoji';

export default class Emojify extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    title: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const spanProps = {};
    const html = parseEmoji(this.props.text);

    if (html !== this.props.text) {
      spanProps.dangerouslySetInnerHTML = { __html: html };
      spanProps.title = this.props.text;
    } else {
      spanProps.children = this.props.text;
    }

    if (this.props.title) {
      spanProps.title = this.props.title;
    }

    return (
      <span
        className={this.props.className}
        style={this.props.style}
        {...spanProps}
      />
    );
  }
}
