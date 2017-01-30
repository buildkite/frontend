import React from 'react';
import classNames from 'classnames';

import { formatNumber } from '../../lib/number';

class StateSwitcher extends React.Component {
  renderLink(label, state, count) {
    let path = window.location.pathname;
    let url = state ? `${path}?state=${state}` : path;
    let active = this.props.state == state;
    let classes = classNames("py1 px3 hover-black hover-bg-silver text-decoration-none", {
      "dark-gray": !active,
      "black":  active
    });

    return (
      <a href={url} className={classes} style={{ lineHeight: "1.8" }}>{formatNumber(count)} {label}</a>
    )
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
