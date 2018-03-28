// @flow

import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const upPointingWhiteNibPath = require('../../../images/up-pointing-white-nib.svg');

const NIB_WIDTH = 32;

const Wrapper = styled.div`
  background-color: #fff;
  border: 1px solid rgb(221, 221, 221);
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.298039) 0px 4px 10px 0px,
              rgba(0, 0, 0, 0.027451) 0px 0px 0px 1px;
  box-sizing: border-box;
  color: rgb(51, 51, 51);
  margin-top: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  position: absolute;
  z-index: 3;
`;

const ScrollZone = styled.div`
  max-height: 80vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Nib = styled.img`
  position: absolute;
  pointer-events: none;
  left: 50%;
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
    const { children, innerRef, nibOffsetX, offsetX, offsetY: top, style, width, ...props } = this.props;

    const offset = (width / 2) - offsetX;

    const popoverStyles = {
      left: `calc(50% - ${offset}px)`,
      top,
      transformOrigin: `${offset + nibOffsetX}px -15px`,
      width,
      zIndex: 3
    };

    return (
      <Wrapper
        innerRef={innerRef}
        style={Object.assign(popoverStyles, style)}
        {...props}
      >
        <Nib
          src={upPointingWhiteNibPath}
          style={{ marginLeft: -(NIB_WIDTH / 2) - offsetX + nibOffsetX }}
          alt=""
        />
        <ScrollZone>
          {children}
        </ScrollZone>
      </Wrapper>
    );
  }
}
