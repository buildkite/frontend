import React from 'react';
import classNames from 'classnames';

import Button from '../../Button';

export default class Suggestion extends React.PureComponent {
  static displayName = "AutocompleteDialog.Suggestion";

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    suggestion: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    selectLabel: React.PropTypes.string.isRequired,
    className: React.PropTypes.string
  };

  defaultProps = {
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
          className="flex-none"
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
