// @flow

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NIB_WIDTH = 32;

const ScrollZone = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Nib = styled.img.attrs({
  className: 'absolute pointer-events-none'
})`
  top: -20px;
  width: ${NIB_WIDTH}px;
  height: 20px;
  z-index: 3;
`;

type Props = {
  children: React$Node,
  nibOffsetX: number,
  offsetX: number,
  offsetY: number,
  style: Object,
  innerRef: Function,
  width: number
};

export default class Popover extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    nibOffsetX: PropTypes.number.isRequired,
    offsetX: PropTypes.number.isRequired,
    offsetY: PropTypes.number.isRequired,
    style: PropTypes.object.isRequired,
    innerRef: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired
  };

  static defaultProps = {
    nibOffsetX: 0,
    offsetX: 0,
    offsetY: 45,
    style: {},
    innerRef() {},
    width: 250
  };

  render() {
    const { children, innerRef, nibOffsetX, offsetX, offsetY: top, style, width } = this.props;

    const offset = (width / 2) - offsetX;

    const popoverStyles = {
      left: `calc(50% - ${offset}px)`,
      top,
      transformOrigin: `${offset + nibOffsetX}px -15px`,
      width,
      zIndex: 100
    };

    return (
      <div
        className="absolute mt1 bg-white rounded-2 shadow border border-gray block py1 transition-popup"
        ref={innerRef}
        style={Object.assign(popoverStyles, style)}
      >
        <Nib
          src={require('../../../images/up-pointing-white-nib.svg')}
          style={{
            left: '50%',
            marginLeft: -(NIB_WIDTH / 2) - offsetX + nibOffsetX
          }}
          alt=""
        />
        <ScrollZone>
          {children}
        </ScrollZone>
      </div>
    );
  }
}
