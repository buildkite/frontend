import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../../Button';

export default class Suggestion extends React.PureComponent {
  static displayName = "AutocompleteDialog.Suggestion";

  static propTypes = {
    children: PropTypes.node.isRequired,
    suggestion: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectLabel: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    selectLabel: "Select"
  };

  render() {
    const classes = classNames("px4 py2 flex", this.props.className);

    return (
      <li className={classes}>
        <div className="flex-auto">
          {this.props.children}
        </div>
        <Button
          onClick={this.handleSelectClick}
          className="ml2 flex-none"
          outline={true}
          theme="default"
        >
          {this.props.selectLabel}
        </Button>
      </li>
    );
  }

  handleSelectClick = (evt) => {
    evt.preventDefault();
    this.props.onSelect(this.props.suggestion);
  }
}
