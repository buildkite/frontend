import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { v4 as uuid } from 'uuid';

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

const STATE_COLORS = {
  pending: '#cdcccc',
  scheduled: '#aeaeae',
  running: '#fdba12',
  passed: '#90c73e',
  blocked: '#90c73e',
  failed: '#F83F23',
  canceled: '#F83F23'
};

class BuildState extends React.Component {
  static propTypes = {
    state: React.PropTypes.oneOf(Object.keys(STATE_COLORS)).isRequired,
    size: React.PropTypes.oneOf(Object.keys(SIZE_DEFINITIONS)).isRequired,
    className: React.PropTypes.string
  };

  static defaultProps = {
    size: 'regular'
  };

  state = {
    uuid: ''
  };

  componentWillMount() {
    this.setState({
      uuid: uuid()
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const sizeDefinition = SIZE_DEFINITIONS[this.props.size] || {};
    const strokeWidth = sizeDefinition.strokeWidth || 2;
    const size = sizeDefinition.size || 32;

    const outerCircleId = `BuildState_${this.state.uuid}_circle`;
    const strokeClipPathId = `BuildState_${this.state.uuid}_strokeClipPath`;

    const { defs, content } = this.renderPaths(strokeWidth);

    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={this.props.className}>
        <defs>
          <circle id={outerCircleId} fill="none" cx="16" cy="16" r="15" stroke={STATE_COLORS[this.props.state]} strokeWidth={strokeWidth * 2} />
          <clipPath id={strokeClipPathId}>
            <use xlinkHref={`#${outerCircleId}`}/>
          </clipPath>
          {defs}
        </defs>
        <use xlinkHref={`#${outerCircleId}`} clipPath={`url(#${strokeClipPathId})`} />
        {content}
      </svg>
    );
  }

  renderPaths(strokeWidth) {
    const applyStroke = {
      fill: 'none',
      stroke: STATE_COLORS[this.props.state],
      strokeWidth
    };

    const maskId = `BuildState_${this.state.uuid}_mask`;

    let defs;
    let content;

    switch (this.props.state) {
      case 'failed':
      case 'canceled':
        content = (
          <g transform="translate(10.000000, 10.000000)" {...applyStroke}>
            <path d="M0.600275489,0.600275489 L11.3997245,11.3997245" />
            <path d="M11.3997245,0.600275489 L0.600275489,11.3997245" />
          </g>
        );
        break;

      case 'passed':
        content = (
          <polyline points="10 17.61 14.38 20.81 21 11.41" {...applyStroke} strokeMiterlimit="10" />
        );
        break;

      case 'blocked':
        content = (
          <g {...applyStroke}>
            <path d="M13,21V11" />
            <path d="M19,21V11" />
          </g>
        );
        break;

      case 'scheduled':
      case 'running':
        defs = (
          <mask id={maskId} x="9" y="9" width="14" height="14" maskUnits="userSpaceOnUse">
            <polygon points="16 16 9 16 9 9 16 9 16 16 23 16 23 23 16 23 16 16" fill="#fff" style={{ transformOrigin: 'center' }} className="animation-spin" />
          </mask>
        );
        content = (
          <g mask={`url(#${maskId})`}>
            <circle cx="16" cy="16" r="6" {...applyStroke} />
          </g>
        );
        break;

      case 'pending':
        content = (
          <path d="M11,16H21" fill="none" {...applyStroke} />
        );
        break;
    }

    return { defs, content };
  }
}

export default BuildState;
