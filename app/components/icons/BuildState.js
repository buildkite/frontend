import React from 'react';
import classNames from 'classnames';

class BuildState extends React.Component {
  static propTypes = {
    state: React.PropTypes.oneOf([ "pending", "scheduled", "running", "passed", "paused", "failed", "canceled" ]).isRequired,
    size: React.PropTypes.oneOf([ "regular","small" ]).isRequired,
    className: React.PropTypes.string
  };

  static defaultProps = {
    size: 'regular'
  };

  render() {
    let strokeWidth = this.props.size == 'regular' ? 2 : 1;
    let size = this.props.size == 'regular' ? 32 : 20;
    let classes = classNames(this.props.className, {
      "animation-spin": this.props.state == "running",
      "animation-spin-slow": this.props.state == "scheduled"
    });

    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={classes}>
        {this.renderPaths(strokeWidth)}
      </svg>
    )
  }

  renderPaths(strokeWidth) {
    switch (this.props.state) {
      case 'failed':
      case 'canceled':
	return (
          <g transform="translate(-219.000000, -19.000000)" stroke="#F83F23" strokeWidth={strokeWidth}>
            <g transform="translate(220.000000, 20.000000)">
              <ellipse fill="none" cx="15" cy="15" rx="15" ry="15"></ellipse>
              <g transform="translate(9.000000, 9.000000)">
                <path d="M0.600275489,0.600275489 L11.3997245,11.3997245"></path>
                <path d="M11.3997245,0.600275489 L0.600275489,11.3997245"></path>
              </g>
            </g>
          </g>
	);

      case 'passed':
	return (
          <g>
            <circle cx="16" cy="16" r="15" fill="none" stroke="#90c73e" strokeMiterlimit="10" strokeWidth={strokeWidth}/>
            <polyline points="10 17.61 14.38 20.81 21 11.41" fill="none" stroke="#90c73e" strokeMiterlimit="10" strokeWidth={strokeWidth}/>
          </g>
	);

      case 'paused':
	return (
          <g>
            <circle cx="16" cy="16" r="15" fill="none" stroke="#90c73e" strokeWidth={strokeWidth}/>
            <path d="M13,21V11" fill="none" stroke="#90c73e" strokeWidth={strokeWidth}/>
            <path d="M19,21V11" fill="none" stroke="#90c73e" strokeWidth={strokeWidth}/>
          </g>
	);

      case 'running':
	return (
          <g>
            <defs>
              <mask id="a" x="9" y="9" width="14" height="14" maskUnits="userSpaceOnUse">
                <polygon points="16 16 9 16 9 9 16 9 16 16 23 16 23 23 16 23 16 16" fill="#fff"/>
              </mask>
            </defs>
            <g>
              <circle cx="16" cy="16" r="15" fill="none" stroke="#fdba12" strokeWidth={strokeWidth}/>
              <g mask="url(#a)">
                <path d="M16,22a6,6,0,1,0-6-6A6,6,0,0,0,16,22Z" fill="none" stroke="#fdba12" strokeWidth={strokeWidth}/>
              </g>
            </g>
          </g>
	);

      case 'scheduled':
	return (
          <g>
	    <defs>
	      <mask id="a" x="9" y="9" width="14" height="14" maskUnits="userSpaceOnUse">
		<polygon points="16 16 9 16 9 9 23 9 23 23 16 23 16 16" fill="#fff"/>
	      </mask>
	    </defs>
	    <g>
	      <circle cx="16" cy="16" r="15" fill="none" stroke="#cdcccc" strokeWidth={strokeWidth}/>
	      <g mask="url(#a)">
		<circle cx="16" cy="16" r="6" fill="none" stroke="#cdcccc" strokeWidth={strokeWidth}/>
	      </g>
	    </g>
	  </g>
	)

      case 'pending':
	return (
          <g>
            <circle cx="16" cy="16" r="15" fill="none" stroke="#cdcccc" strokeWidth={strokeWidth}/>
            <path d="M11,16H21" fill="none" stroke="#cdcccc" strokeWidth={strokeWidth}/>
          </g>
	)
    }
  }
}

export default BuildState
