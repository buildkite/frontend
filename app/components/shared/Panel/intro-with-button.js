import React from "react";

class IntroWithButton extends React.Component {
  static displayName = "Panel.IntroWithButton";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    return (
      <div className="py3 px3 flex">
        {this.props.children[0]}
        <div className="ml3">
          {this.props.children[1]}
        </div>
      </div>
    );
  }
}

export default IntroWithButton;
