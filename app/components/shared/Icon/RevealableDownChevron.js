import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from '../Icon';

const RotatableIcon = styled(Icon)`
  transform: rotate(${(props) => props.revealed ? -90 : 90}deg);
  trasform-origin: center 0;
  transition: transform 300ms;
  will-change: transform;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;

  polyline {
    stroke-width: ${(props) => props.strokeWidth}px;
  }
`;

export default class RevealableDownChevron extends React.PureComponent {
  static propTypes = {
    revealed: PropTypes.bool,
    size: PropTypes.number,
    strokeWidth: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    revealed: false,
    size: 14,
    strokeWidth: 2
  }

  render() {
    return (
      <RotatableIcon
        icon="chevron-right"
        revealed={this.props.revealed}
        size={this.props.size}
        strokeWidth={this.props.strokeWidth}
        className={this.props.className}
        style={this.props.style}
      />
    );
  }
}