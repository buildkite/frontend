import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { v4 as uuid } from 'uuid';

import BuildStates from '../../constants/BuildStates';

const SIZE_DEFINITIONS = {
  Regular: {
    strokeWidth: 2,
    size: 32
  },
  Small: {
    strokeWidth: 3,
    size: 20
  },
  XSmall: {
    strokeWidth: 4,
    size: 13
  }
};

const STATE_COLORS = {
  [BuildStates.PENDING]: '#cdcccc',
  [BuildStates.SCHEDULED]: '#bbbbbb',
  [BuildStates.RUNNING]: '#fdba12',
  [BuildStates.PASSED]: '#90c73e',
  [BuildStates.BLOCKED]: '#90c73e',
  [BuildStates.FAILED]: '#F83F23',
  [BuildStates.CANCELED]: '#F83F23',
  [BuildStates.CANCELING]: '#F83F23',
  [BuildStates.SKIPPED]: '#83B0E4',
  [BuildStates.NOT_RUN]: '#83B0E4'
};

class BuildState extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    size: React.PropTypes.number.isRequired,
    state: React.PropTypes.oneOf(Object.keys(STATE_COLORS)).isRequired,
    strokeWidth: React.PropTypes.number.isRequired,
    style: React.PropTypes.object
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
    const { className, size, strokeWidth, style } = this.props;

    const outerCircleId = `BuildState_${this.state.uuid}_circle`;
    const strokeClipPathId = `BuildState_${this.state.uuid}_strokeClipPath`;

    const { defs, content } = this.renderPaths();

    return (
      <svg
        className={className}
        style={style}
        width={size}
        height={size}
        viewBox="0 0 32 32"
      >
        <defs>
          <circle
            id={outerCircleId}
            fill="none"
            cx="16"
            cy="16"
            r="15"
            stroke={STATE_COLORS[this.props.state]}
            strokeWidth={strokeWidth * 2}
          />
          <clipPath id={strokeClipPathId}>
            <use xlinkHref={`#${outerCircleId}`}/>
          </clipPath>
          {defs}
        </defs>
        <use
          xlinkHref={`#${outerCircleId}`}
          clipPath={`url(#${strokeClipPathId})`}
        />
        {content}
      </svg>
    );
  }

  renderPaths() {
    const applyStroke = {
      fill: 'none',
      stroke: STATE_COLORS[this.props.state],
      strokeWidth: this.props.strokeWidth
    };

    const maskId = `BuildState_${this.state.uuid}_mask`;

    let defs;
    let content;

    switch (this.props.state) {
      case BuildStates.FAILED:
      case BuildStates.CANCELED:
        content = (
          <g transform="translate(10.000000, 10.000000)" {...applyStroke}>
            <path d="M0.600275489,0.600275489 L11.3997245,11.3997245" />
            <path d="M11.3997245,0.600275489 L0.600275489,11.3997245" />
          </g>
        );
        break;

      case BuildStates.PASSED:
        content = (
          <polyline points="10 17.61 14.38 20.81 21 11.41" {...applyStroke} strokeMiterlimit="10" />
        );
        break;

      case BuildStates.BLOCKED:
        content = (
          <g {...applyStroke}>
            <path d="M13,21V11" />
            <path d="M19,21V11" />
          </g>
        );
        break;

      case BuildStates.SCHEDULED:
      case BuildStates.RUNNING:
      case BuildStates.CANCELING:
        defs = (
          <mask id={maskId} x="9" y="9" width="14" height="14" maskUnits="userSpaceOnUse">
            <polygon
              className="animation-spin"
              style={{ transformOrigin: 'center' }}
              fill="#fff"
              points="16 16 9 16 9 9 16 9 16 16 23 16 23 23 16 23 16 16"
            />
          </mask>
        );
        content = (
          <g mask={`url(#${maskId})`}>
            <circle cx="16" cy="16" r="6" {...applyStroke} />
          </g>
        );
        break;

      case BuildStates.PENDING:
      case BuildStates.SKIPPED:
      case BuildStates.NOT_RUN:
        content = (
          <path d="M11,16H21" fill="none" {...applyStroke} />
        );
        break;
    }

    return { defs, content };
  }
}

const exported = {};

Object.keys(SIZE_DEFINITIONS).forEach((size) => {
  const component = (props) => <BuildState {...props} {...SIZE_DEFINITIONS[size]} />;
  component.displayName = `BuildState.${size}`;

  exported[size] = component;
});

export default exported;

