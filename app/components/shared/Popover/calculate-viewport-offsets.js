// @flow

const { abs, min, max } = Math;

// margin (in pixels) to maintain around automatically-positioned dropdowns
const SCREEN_MARGIN = 10;

const combineAxisOffsets = (lowOffset, highOffset) => (
  abs(min(lowOffset - SCREEN_MARGIN, 0)) - abs(max(highOffset + SCREEN_MARGIN, 0))
);

type ViewportOffsets = {
  offsetX: number,
  offsetY: number,
  width: number
};

export default (requestedWidth: number = 250, offsetNode: HTMLElement): ViewportOffsets => {
  const windowWidth = window.innerWidth;
  const { left: offsetNodeLeft, width: offsetNodeWidth, height: offsetNodeHeight } = offsetNode.getBoundingClientRect();

  const offsetNodeCenterX = offsetNodeLeft + (offsetNodeWidth / 2);

  // automatically shrink the popover to fit the screen if the screen is too small
  // this shouldn't be needed often, but seems worth keeping just in case!
  const width = min(requestedWidth, windowWidth - (SCREEN_MARGIN * 2));

  // if `leftOffset` is < 0, we need to shift the popup to the right
  const leftOffset = offsetNodeCenterX - (width / 2);

  // if `rightOffset` is > 0, we need to shift the popup to the left
  const rightOffset = offsetNodeCenterX + (width / 2) - windowWidth;

  // calculate the overall offset required to stay on-screen
  const offsetX = combineAxisOffsets(leftOffset, rightOffset);
  const offsetY = offsetNodeHeight;

  return {
    offsetX,
    offsetY,
    width
  };
};
