import React from 'react';

var Icon = function(props) {
  return (
    <svg viewBox="0 0 20 20" width="20px" height="20px" className={props.className} style={{fill: "currentColor", verticalAlign: "middle"}}>
      <title>{props.title}</title>
      {props.children}
    </svg>
  );
}

Icon.propTypes = {
  title: React.PropTypes.string.isRequired,
  className: React.PropTypes.string,
  children: React.PropTypes.node.isRequired
};

Icon.Placeholder = function() {
  return (
    <rect x={0} y={0} width={20} height={20} />
  )
}

export default Icon;
