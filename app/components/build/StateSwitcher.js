import React from 'react';
import classNames from 'classnames';

import { formatNumber } from '../../lib/number';

const StateLink = (props) => {
  const classes = classNames("border-bottom hover-lime semi-bold text-decoration-none py2 px3 line-height-2 hover-border-lime", {
    "dark-gray border-gray": !props.active,
    "black border-black": props.active
  });

  return (
    <a href={props.href} className={classes} style={{ borderBottomWidth: 2 }}>
      {props.children}
    </a>
  );
};

StateLink.propTypes = {
  active: React.PropTypes.bool.isRequired,
  href: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired
};

const Count = (props) => {
  return (
    <span className="tabular-numerals">{formatNumber(props.count)}</span>
  );
};

Count.propTypes = {
  count: React.PropTypes.number.isRequired
};

class StateSwitcher extends React.PureComponent {
  static propTypes = {
    buildsCount: React.PropTypes.number,
    runningBuildsCount: React.PropTypes.number,
    scheduledBuildsCount: React.PropTypes.number,
    state: React.PropTypes.string,
    path: React.PropTypes.string
  };

  matchesState(state) {
    return this.props.state === state && document.location.toString().indexOf(this.props.path) !== -1;
  }

  url(state) {
    if (this.props.state) {
      return `${this.props.path}?state=${state}`;
    } else {
      return this.props.path;
    }
  }

  render() {
    return (
      <div className="flex">
        <StateLink href={this.url()} active={this.matchesState(null)}>
          {'All '}
          <Count count={this.props.buildsCount} />
          {' Builds'}
        </StateLink>
        <StateLink href={this.url('running')} active={this.matchesState('runnning')}>
          <Count count={this.props.runningBuildsCount} />
          {' Running'}
        </StateLink>
        <StateLink href={this.url('scheduled')} active={this.matchesState('scheduled')}>
          <Count count={this.props.scheduledBuildsCount} />
          {' Scheduled'}
        </StateLink>
      </div>
    );
  }
}

export default StateSwitcher;
