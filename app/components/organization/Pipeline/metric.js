import React from 'react';
import classNames from 'classnames';
import SectionLink from './section-link';

class Metric extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    href: React.PropTypes.string
  };

  render() {
    return (
      <SectionLink href={this.props.href} className="flex flex-column right-align" style={{width: '7em'}}>
        {this.renderValue()}
        <span className="h6 regular dark-gray truncate">{this.props.label}</span>
      </SectionLink>
    )
  }

  renderValue() {
    const match = String(this.props.value).match(/([\d\.]+)(.*)/);
    const valueClasses = "h3 light m0 line-height-1";

    if (match) {
      return (
        <span className="truncate">
          <span className={valueClasses}>{match[1]}</span>
          <span className="h6 regular m0 line-height-1">{match[2]}</span>
        </span>
      )
    } else {
      return (
        <span className={classNames(valueClasses, "truncate")}>{this.props.value}</span>
      );
    }
  }
}

export default Metric
