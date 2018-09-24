// @flow

const { abs, min, max } = Math;

type ViewportOffsets = {
  offsetX: number,
  offsetY: number,
  width: number
};

// margin (in pixels) to maintain around automatically-positioned dropdowns
const SCREEN_MARGIN = 10;

let safeAreaProbeNode: ?HTMLDivElement;

const detectSafeArea = () => {
  if (!safeAreaProbeNode) {
    safeAreaProbeNode = document.createElement('div');
    safeAreaProbeNode.setAttribute('style',
      'padding: constant(safe-area-inset-top) constant(safe-area-inset-right) constant(safe-area-inset-bottom) constant(safe-area-inset-left);' +
      'padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);' +
      'position: absolute;' +
      'opacity: 0;' +
      'visibility: hidden;'
    );
    document.body && document.body.appendChild(safeAreaProbeNode);
  }

  let { paddingLeft: left, paddingRight: right, paddingTop: top, paddingBottom: bottom } = getComputedStyle(safeAreaProbeNode);

  left = parseFloat(left);
  right = parseFloat(right);
  top = parseFloat(top);
  bottom = parseFloat(bottom);

  return { left, right, top, bottom };
};

const combineAxisOffsets = (lowOffset, highOffset, computedScreenMargin = SCREEN_MARGIN) => (
  abs(min(lowOffset - SCREEN_MARGIN, 0)) - abs(max(highOffset + computedScreenMargin, 0))
);

export default (requestedWidth: number = 250, offsetNode: HTMLElement): ViewportOffsets => {
  const safeArea = detectSafeArea();
  const computedScreenMargin = (safeArea.left + safeArea.right) / 2 + SCREEN_MARGIN;
  const windowWidth = window.innerWidth;
  const { left: offsetNodeLeft, width: offsetNodeWidth, height: offsetNodeHeight } = offsetNode.getBoundingClientRect();

  const offsetNodeCenterX = offsetNodeLeft + (offsetNodeWidth / 2);

  // automatically shrink the popover to fit the screen if the screen is too small
  // this shouldn't be needed often, but seems worth keeping just in case!
  const width = min(requestedWidth, windowWidth - (computedScreenMargin * 2));

  // if `leftOffset` is < 0, we need to shift the popup to the right
  const leftOffset = offsetNodeCenterX - (width / 2);

  // if `rightOffset` is > 0, we need to shift the popup to the left
  const rightOffset = offsetNodeCenterX + (width / 2) - windowWidth;

  // calculate the overall offset required to stay on-screen
  const offsetX = combineAxisOffsets(leftOffset, rightOffset, computedScreenMargin);
  const offsetY = offsetNodeHeight;

  return {
    offsetX,
    offsetY,
    width
  };
};
