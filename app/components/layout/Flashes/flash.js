import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import FlashesStore from '../../../stores/FlashesStore';

class Flash extends React.PureComponent {
  static propTypes = {
    flash: PropTypes.shape({
      type: PropTypes.string.isRequired,
      message: PropTypes.node.isRequired
    }),
    onRemoveClick: PropTypes.func.isRequired
  };

  render() {
    const classes = classNames("flex items-center mb2 border rounded border-dark-gray", {
      "border-red red": this.props.flash.type === FlashesStore.ERROR,
      "border-lime lime": this.props.flash.type === FlashesStore.SUCCESS
    });

    return (
      <div className={classes}>
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
