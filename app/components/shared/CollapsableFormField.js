import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

let _collapsableFormFieldCounter = 0;

// Legacy bootstap collapsable field
//
// This should be replaced with something more akin to CollapsableArea
export default class CollapsableFormField extends React.PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired,
    collapsed: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired
  };

  state = {
    id: "collapsable-form-" + (_collapsableFormFieldCounter += 1),
    collapsed: this.props.collapsed
  };

  render() {
    const containerClasses = classNames("CollapsableFormComponent form-group", {
      "CollapsableFormComponent--collapsed": this.state.collapsed
    });

    const contentClasses = classNames("CollapsableFormComponent__content collapse", {
      "in": !this.state.collapsed
    });

    const buttonClasses = classNames("CollapseExpandLinkComponent twbs-btn twbs-btn-link", {
      "collapsed": this.state.collapsed
    });

    return (
      <div className={containerClasses}>
        <button type="button" className={buttonClasses} data-toggle="collapse" data-target={"#" + this.state.id} aria-expanded={!this.state.collapsed} aria-controls={this.state.id} style={{ paddingLeft: 0 }}>
          <strong className="semi-bold">{this.props.label}</strong>
          <i className="fa fa-angle-down" style={{ marginLeft: 6 }} />
        </button>
        <div className={contentClasses} id={this.state.id} aria-expanded={!this.state.collapsed}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
