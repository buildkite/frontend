import React from 'react';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

const SIZE_DEFINITIONS = {
  regular: {
    strokeWidth: 2,
    size: 32
  },
  small: {
    strokeWidth: 3,
    size: 20
  }
};

const passedStateDefinition = {
  strokeColor: '#90c73e'
};

const failedStateDefinition = {
  strokeColor: '#F83F23'
};

const STATE_DEFINITIONS = {
  pending: {
    strokeColor: '#cdcccc'
  },
  scheduled: {
    animation: 'animation-spin-slow',
    strokeColor: '#aeaeae'
  },
  running: {
    animation: 'animation-spin',
    strokeColor: '#fdba12'
  },
  passed: passedStateDefinition,
  blocked: passedStateDefinition,
  failed: failedStateDefinition,
  canceled: failedStateDefinition
};

class BuildState extends React.Component {
  static propTypes = {
    state: React.PropTypes.oneOf(Object.keys(STATE_DEFINITIONS)).isRequired,
    size: React.PropTypes.oneOf(Object.keys(SIZE_DEFINITIONS)).isRequired,
    className: React.PropTypes.string
  };

  static defaultProps = {
    size: 'regular'
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const sizeDefinition = SIZE_DEFINITIONS[this.props.size] || {};
    const strokeWidth = sizeDefinition.strokeWidth || 2;
    const size = sizeDefinition.size || 32;

    const circleId = parseInt(Math.random().toString(10).replace('.', ''), 10).toString(36);

    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={this.props.className}>
        <defs>
          <circle id={`circle_${circleId}`} fill="none" cx="16" cy="16" r="15" stroke={STATE_DEFINITIONS[this.props.state].strokeColor} strokeWidth={strokeWidth * 2} />
          <clipPath id={`circleClip_${circleId}`}>
            <use xlinkHref={`#circle_${circleId}`}/>
          </clipPath>
        </defs>
        <use xlinkHref={`#circle_${circleId}`} clipPath={`url(#circleClip_${circleId})`} />
        {this.renderPaths(strokeWidth)}
      </svg>
    );
  }

  renderPaths(strokeWidth) {
    const applyStroke = {
      fill: 'none',
      stroke: STATE_DEFINITIONS[this.props.state].strokeColor,
      strokeWidth
    };

    const applyAnimation = {
      style: { transformOrigin: 'center' },
      className: classNames({
        [STATE_DEFINITIONS[this.props.state] && STATE_DEFINITIONS[this.props.state].animation]: this.props.state && STATE_DEFINITIONS[this.props.state] && STATE_DEFINITIONS[this.props.state].animation
      })
    };

    switch (this.props.state) {
      case 'failed':
      case 'canceled':
        return (
          <g {...applyStroke}>
            <g transform="translate(10.000000, 10.000000)">
              <path d="M0.600275489,0.600275489 L11.3997245,11.3997245" />
              <path d="M11.3997245,0.600275489 L0.600275489,11.3997245" />
            </g>
          </g>
        );

      case 'passed':
        return (
          <g>
            <polyline points="10 17.61 14.38 20.81 21 11.41" {...applyStroke} strokeMiterlimit="10" />
          </g>
        );

      case 'blocked':
        return (
          <g>
            <path d="M13,21V11" {...applyStroke} />
            <path d="M19,21V11" {...applyStroke} />
          </g>
        );

      case 'scheduled':
      case 'running':
        return (
          <g>
            <defs>
              <mask id="a" x="9" y="9" width="14" height="14" maskUnits="userSpaceOnUse">
                <polygon points="16 16 9 16 9 9 16 9 16 16 23 16 23 23 16 23 16 16" fill="#fff" {...applyAnimation}/>
              </mask>
            </defs>
            <g mask="url(#a)">
              <path d="M16,22a6,6,0,1,0-6-6A6,6,0,0,0,16,22Z" {...applyStroke} />
            </g>
          </g>
        );

      case 'pending':
        return (
          <g>
            <path d="M11,16H21" fill="none" {...applyStroke} />
          </g>
        );
    }
  }
}

export default BuildState;
