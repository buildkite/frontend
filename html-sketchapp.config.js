module.exports = {
  viewports: {
    Desktop: '1024x768',
    Mobile: '320x568'
  },
  symbolLayerMiddleware: (args) => {
    const { layer, SVG, RESIZING_CONSTRAINTS } = args;

    if (layer instanceof SVG) {
      layer.setResizingConstraint(RESIZING_CONSTRAINTS.TOP, RESIZING_CONSTRAINTS.LEFT, RESIZING_CONSTRAINTS.WIDTH, RESIZING_CONSTRAINTS.HEIGHT);
    } else {
      layer.setResizingConstraint(RESIZING_CONSTRAINTS.LEFT, RESIZING_CONSTRAINTS.TOP);
    }
  }
  // symbolMiddleware: (args) => {
  //   const { symbol, node, suffix, RESIZING_CONSTRAINTS } = args;
  //   // TODO: Be smarter about setting resizing for certain symbols
  // }
};