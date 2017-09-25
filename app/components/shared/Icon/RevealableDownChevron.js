// @flow

import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from '../Icon';

const RevealableDownChevron = styled(Icon).attrs({
  icon: "chevron-right"
})`
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

RevealableDownChevron.propTypes = {
  revealed: PropTypes.bool,
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

RevealableDownChevron.defaultProps = {
  revealed: false,
  size: 14,
  strokeWidth: 2
};

export default RevealableDownChevron;
