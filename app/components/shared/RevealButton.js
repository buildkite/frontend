import React from 'react';
import PropTypes from 'prop-types';
import reffer from 'reffer';

import Button from './Button';

class RevealButton extends React.Component {
  static propTypes = {
    caption: PropTypes.node,
    children: PropTypes.node
  };

  static defaultProps = {
    caption: 'Reveal'
  };

  state = {
    revealed: false
  };

  handleRevealClick = (evt) => {
    evt.preventDefault();

    this.setState(
      { revealed: true },
      () => {
        let range, selection;
        if (this._contentElement) {
          range = document.createRange();
          range.selectNodeContents(this._contentElement);

          selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    );
  };

  render() {
    if (this.state.revealed) {
      return (
        <div className="rounded border border-gray p1" ref={this::reffer('_contentElement')}>{this.props.children}</div>
      );
    }

    return (
      <Button onClick={this.handleRevealClick} outline={true} theme="default">{this.props.caption}</Button>
    );
  }
}

export default RevealButton;
