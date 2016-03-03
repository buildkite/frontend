import React from "react";
import classNames from 'classnames';

var _collapsableFormFieldCounter = 0;

class CollapsableFormField extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    collapsed: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node.isRequired
  };

  state = {
    id: "collapsable-form-" + (_collapsableFormFieldCounter += 1),
    collapsed: this.props.collapsed
  };

  render() {
    let containerClasses = classNames("CollapsableFormComponent form-group", {
      "CollapsableFormComponent--collapsed": this.state.collapsed
    });

    let contentClasses = classNames("CollapsableFormComponent__content collapse", {
      "in": !this.state.collapsed
    });

    let buttonClasses = classNames("CollapseExpandLinkComponent twbs-btn twbs-btn-link", {
      "collapsed": this.state.collapsed
    });

    return (
      <div className={containerClasses}>
        <button type="button" className={buttonClasses} data-toggle="collapse" data-target={"#" + this.state.id} aria-expanded={!this.state.collapsed} aria-controls={this.state.id} style={{ paddingLeft: 0 }}>
          <strong className="bold">{this.props.label}</strong>
          <i className="fa fa-angle-down" style={{ marginLeft: 6 }}></i>
        </button>
        <div className={contentClasses} id={this.state.id} aria-expanded={!this.state.collapsed}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default CollapsableFormField;
