import React from 'react';

export default class BuildStatus extends React.Component {
  static propTypes = {
    status: React.PropTypes.oneOf(["pending", "scheduled", "running", "passed", "paused", "failed", "canceled", "skipped"]).isRequired,
    size: React.PropTypes.oneOf(["regular","small"]).isRequired,
    className: React.PropTypes.string
  };

  static defaultProps = {
    size: 'regular'
  };

  render() {
    return (this.props.size == 'regular') ? this._renderRegular() : this._renderSmall();
  }

  _renderRegular() {
    return (
      <svg width="32px" height="32px" viewBox="0 0 32 32" className={this.props.className}>
        <g transform="translate(-219.000000, -19.000000)" stroke="#F83F23" strokeWidth="2">
          <g transform="translate(220.000000, 20.000000)">
            <ellipse fill="none" cx="15" cy="15" rx="15" ry="15"></ellipse>
            <g transform="translate(9.000000, 9.000000)">
              <path d="M0.600275489,0.600275489 L11.3997245,11.3997245"></path>
              <path d="M11.3997245,0.600275489 L0.600275489,11.3997245"></path>
            </g>
          </g>
        </g>
      </svg>
    )
  }

  _renderSmall() {
    return (
      <svg width="20px" height="20px" viewBox="0 0 20 20" className={this.props.className}>
      </svg>
    )
  }
}
