// @flow

import React from 'react';
import classNames from 'classnames';
import FlashesStore, { type FlashItem } from 'app/stores/FlashesStore';

type Props = {
  flash: FlashItem,
  onRemoveClick: (flash: FlashItem) => void
};

export default class Flash extends React.PureComponent<Props> {
  render() {
    const classes = classNames("flex items-center mb2 border rounded border-dark-gray", {
      "border-red red": this.props.flash.type === FlashesStore.ERROR,
      "border-lime lime": this.props.flash.type === FlashesStore.SUCCESS
    });

    return (
      <div className={classes}>
        <div
          className="flex-auto px4 py3"
          data-flash-message={true}
        >
          {this.props.flash.message}
        </div>
        <button
          className="btn px4 py3"
          onClick={this.handleCloseClick}
          data-flash-close={true}
        >
          Close
        </button>
      </div>
    );
  }

  handleCloseClick = () => {
    this.props.onRemoveClick(this.props.flash);
  };
}
