import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import { formatNumber } from '../../lib/number';

class StateSwitcher extends React.Component {
  static propTypes = {
    buildsCount: React.PropTypes.number,
    runningBuildsCount: React.PropTypes.number,
    scheduledBuildsCount: React.PropTypes.number,
    state: React.PropTypes.string,
    path: React.PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  renderLink(label, state, count) {
    const url = state ? `${this.props.path}?state=${state}` : this.props.path;
    const active = this.props.state === state;
    const classes = classNames("hover-black hover-bg-silver text-decoration-none", {
      "dark-gray": !active,
      "black": active
    });

    return (
      <a
        href={url}
        className={classes}
        style={{
          lineHeight: 1.2,
          padding: '.75em 1em'
        }}
      >
        {formatNumber(count)} {label}
      </a>
    );
  }

  render() {
    return (
      <div className="flex">
        <div className="rounded-left border-left border-top border-bottom border-gray flex items-center">
          {this.renderLink("Builds", null, this.props.buildsCount)}
        </div>
        <div className="border-left border-top border-bottom border-gray flex items-center">
          {this.renderLink("Running", "running", this.props.runningBuildsCount)}
        </div>
        <div className="rounded-right border border-gray flex items-center">
          {this.renderLink("Scheduled", "scheduled", this.props.scheduledBuildsCount)}
        </div>
      </div>
    );
  }
}

export default StateSwitcher;
