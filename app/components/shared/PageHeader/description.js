import React from "react";

class Description extends React.Component {
  static displayName = "PageHeader.Description";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="dark-gray mt1">
        {this.props.children}
      </div>
    );
  }
}

export default Description;
