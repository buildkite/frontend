module.exports = {
  symbolLayerMiddleware: (args) => {
    const { layer, SVG, RESIZING_CONSTRAINTS } = args;

    if (layer instanceof SVG) {
      layer.setResizingConstraint(RESIZING_CONSTRAINTS.TOP, RESIZING_CONSTRAINTS.LEFT, RESIZING_CONSTRAINTS.WIDTH, RESIZING_CONSTRAINTS.HEIGHT);
    } else {
      layer.setResizingConstraint(RESIZING_CONSTRAINTS.LEFT, RESIZING_CONSTRAINTS.TOP);
    }
  }
};