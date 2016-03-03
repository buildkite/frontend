import React from 'react';

var Icon = function(props) {
  return (
    <svg viewBox="0 0 20 20" width="20px" height="20px" className={props.className} style={{fill: "currentColor", verticalAlign: "middle"}}>
      {titleNode()}
      {props.children}
    </svg>
  );

  function titleNode() {
    if (props.title) {
      return (
        <title>{props.title}</title>
      );
    }
  }
}

Icon.propTypes = {
  title: React.PropTypes.string,
  className: React.PropTypes.string,
  children: React.PropTypes.node.isRequired
};

Icon.Placeholder = function() {
  return (
    <rect x={0} y={0} width={20} height={20} />
  )
}

Icon.Placeholder.displayName = "Icon.Placeholder"

export default Icon;
