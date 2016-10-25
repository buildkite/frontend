import React from 'react';
import classNames from 'classnames';

import FlashesStore from '../../../stores/FlashesStore';

class Flash extends React.Component {
  static propTypes = {
    flash: React.PropTypes.shape({
      id: React.PropTypes.number.isRequired,
      type: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onRemoveClick: React.PropTypes.func.isRequired
  };

  render() {
    const classes = classNames("py2 px3 rounded flex items-center mb2 bg-gray", {
      "bg-red white": this.props.flash.type === FlashesStore.ERROR,
      "bg-green white": this.props.flash.type === FlashesStore.SUCCESS
    });

    return (
      <div key={this.props.flash.id} className={classes}>
        <div className="flex-auto" data-flash-message>{this.props.flash.message}</div>
        <button onClick={this.handleCloseClick} className="btn pl0 pr0" data-flash-close>Close</button>
      </div>
    );
  }

  handleCloseClick = () => {
    this.props.onRemoveClick(this.props.flash);
  };
}

export default Flash;
