import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatNumber } from '../../lib/number';

class StateSwitcher extends React.PureComponent {
  static propTypes = {
    buildsCount: PropTypes.number,
    runningBuildsCount: PropTypes.number,
    scheduledBuildsCount: PropTypes.number,
    state: PropTypes.string,
    path: PropTypes.string
  };

  renderLink(label, state, count) {
    const url = state ? `${this.props.path}?state=${state}` : this.props.path;
    const active = this.props.state === state;
    const classes = classNames("block center hover-black hover-bg-silver text-decoration-none", {
      "dark-gray": !active,
      "black": active
    });

    return (
      <a
        href={url}
        className={classes}
        style={{
          lineHeight: 1.2,
          padding: '.75em 1em',
          width: '100%'
        }}
      >
        {formatNumber(count)} {label}
      </a>
    );
  }

  render() {
    const buildsTitle = this.props.buildsCount === 1 ? "Build" : "Builds";

    return (
      <div className={classNames('flex', this.props.className)}>
        <div className="rounded-left border-left border-top border-bottom border-gray flex-auto flex items-center">
          {this.renderLink(buildsTitle, null, this.props.buildsCount)}
        </div>
        <div className="border-left border-top border-bottom border-gray flex-auto flex items-center">
          {this.renderLink("Running", "running", this.props.runningBuildsCount)}
        </div>
        <div className="rounded-right border border-gray flex-auto flex items-center">
          {this.renderLink("Scheduled", "scheduled", this.props.scheduledBuildsCount)}
        </div>
      </div>
    );
  }
}

export default StateSwitcher;
