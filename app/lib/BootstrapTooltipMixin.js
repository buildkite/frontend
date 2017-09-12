/* global jQuery */

import ReactDOM from 'react-dom';

export default {
  componentDidMount() {
    this._tooltiperize();
  },

  componentDidUpdate() {
    this._tooltiperize();
  },

  _tooltiperize() {
    const component = ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

    // If the root node of the react component is the tooltipper, just apply the
    // plugin to that and not bother about looking at children.
    if (component.getAttribute('data-toggle') === 'tooltip') {
      this._fixTooltip(component);
    } else {
      jQuery(component)
        .find("[data-toggle='tooltip']")
        .each((idx, child) => this._fixTooltip(child));
    }
  },

  _fixTooltip(element) {
    const $element = jQuery(element);

    const showing = !!$element.attr('aria-describedby');

    $element.data('animation', false);
    $element.tooltip('destroy').tooltip();
    $element.data('original-title', $element.attr('title'));

    $element.tooltip(showing ? 'show' : 'hide');
  }
};

