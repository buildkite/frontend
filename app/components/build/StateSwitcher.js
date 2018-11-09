// @flow

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { formatNumber } from 'app/lib/number';

type Props = {
  buildsCount: number,
  runningBuildsCount: number,
  scheduledBuildsCount: number,
  className?: string,
  state?: string,
  path: string,
  testId?: string
};

class StateSwitcher extends React.PureComponent<Props> {
  static propTypes = {
    buildsCount: PropTypes.number.isRequired,
    runningBuildsCount: PropTypes.number.isRequired,
    scheduledBuildsCount: PropTypes.number.isRequired,
    className: PropTypes.string,
    state: PropTypes.string,
    path: PropTypes.string.isRequired,
    testId: PropTypes.string,
  };

  renderLink(label: React$Node, state: ?string, count: number) {
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
      <div data-testid={this.props.testId} className={classNames('flex', this.props.className)}>
        <div data-testid="BuildCount" className="rounded-left border-left border-top border-bottom border-gray flex-auto flex items-center">
          {this.renderLink(buildsTitle, null, this.props.buildsCount)}
        </div>
        <div data-testid="RunningBuildCount" className="border-left border-top border-bottom border-gray flex-auto flex items-center">
          {this.renderLink("Running", "running", this.props.runningBuildsCount)}
        </div>
        <div data-testid="ScheduledBuildCount" className="rounded-right border border-gray flex-auto flex items-center">
          {this.renderLink("Scheduled", "scheduled", this.props.scheduledBuildsCount)}
        </div>
      </div>
    );
  }
}

export default StateSwitcher;
