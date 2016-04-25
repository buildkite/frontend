import React from 'react';
import classNames from 'classnames';
import SectionLink from './section-link';

export default class Metric extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string.isRequired,
    href: React.PropTypes.string,
    linkClassNames: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <SectionLink href={this.props.href} className="flex flex-column items-stretch px2 py3" style={{width:'6em'}}>
        {this._renderValue()}
        {this._renderLabel()}
      </SectionLink>
    )
  }

  _renderValue() {
    const match = String(this.props.value).match(/([\d\.]+)(.*)/);
    const valueClasses = "h3 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h5 regular m0 line-height-1">{match[2]}</span>
        </span>
      )
    } else {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.value}</span>
      );
    }
  }

  _renderLabel() {
    return (
      <span className="h6 regular dark-gray truncate mt1">{this.props.label}</span>
    );
  }
}
