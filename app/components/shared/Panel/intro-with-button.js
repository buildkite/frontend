import React from "react";

const IntroWithButton = (props) =>
  <div className="py2 px3 flex">
    {props.children[0]}
    <div className="ml2">
      {props.children[1]}
    </div>
  </div>

IntroWithButton.propTypes = {
  children: React.PropTypes.node.isRequired
};

IntroWithButton.displayName = "Panel.IntroWithButton";

export default IntroWithButton;
