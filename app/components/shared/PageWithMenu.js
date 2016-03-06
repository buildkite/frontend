import React from 'react';

const PageWithMenu = (props) => {
  let children = React.Children.toArray(props.children);

  return (
    <div className="container">
      <div className="clearfix mxn2">
        <div className="md-col md-col-3 px2">
          {children[0]}
        </div>
        <div className="md-col md-col-9 px2">
          {children.slice(1)}
        </div>
      </div>
    </div>
  );
}

PageWithMenu.propTypes = {
  children: React.PropTypes.node.isRequired
};

export default PageWithMenu
