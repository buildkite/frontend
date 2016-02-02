import React from "react";
import classNames from 'classnames';

export default function ButtonGroup(props) {
  var buttons = [];
  var last = props.children.length - 1;

  props.children.forEach((node, index) => {
    if(index == 0) {
      var classes = "left rounded-left border-left border-top border-bottom";
    } else if(index == last) {
      var classes = "left rounded-right border";
    } else {
      var classes = "left no-rounded border-left border-top border-bottom";
    }

    buttons.push(
      <div key={index} className={classes}>{node}</div>
    )
  });

  return (
    <div className="inline-block clearfix">
      {buttons}
    </div>
  );
}

ButtonGroup.propTypes = {
  children: React.PropTypes.node
}
