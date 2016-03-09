import React from "react";

class IntroWithButton extends React.Component {
  static displayName = "Panel.IntroWithButton";

  static propTypes = {
    children: React.PropTypes.node.isRequired
  };

  render() {
    let children = React.Children.toArray(this.props.children);

    let intro;
    let button;
    if(children.length == 1) {
      intro = children;
    } else {
      button = children.pop();
      intro = children;
    }

    if(button) {
      button = (
        <div className="ml3">
          {button}
        </div>
      );
    }

    return (
      <div className="py3 px3 flex">
        {intro}
        {button}
      </div>
    );
  }
}

export default IntroWithButton;
