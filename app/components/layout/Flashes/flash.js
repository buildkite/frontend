import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlashesStore from '../../../stores/FlashesStore';

class Flash extends React.Component {
  static propTypes = {
    flash: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired
    }),
    onRemoveClick: PropTypes.func.isRequired
  };

  render() {
    const classes = classNames("flex items-center mb2 border rounded border-dark-gray", {
      "border-red red": this.props.flash.type === FlashesStore.ERROR,
      "border-lime lime": this.props.flash.type === FlashesStore.SUCCESS
    });

    return (
      <div key={this.props.flash.id} className={classes}>
        <div className="flex-auto px4 py3" data-flash-message={true}>{this.props.flash.message}</div>
        <button className="btn px4 py3" onClick={this.handleCloseClick} data-flash-close={true}>Close</button>
      </div>
    );
  }

  handleCloseClick = () => {
    this.props.onRemoveClick(this.props.flash);
  };
}

export default Flash;
