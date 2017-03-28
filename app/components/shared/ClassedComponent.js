import React from "react";
import classNames from "classnames";

const buildClassName = (prebakedClasses, props) => {
  // if it's a function, call the thing with our props
  if (typeof prebakedClasses === 'function') {
    prebakedClasses = prebakedClasses(props);
  }

  // if it's (now) a string, split it on dots and spaces
  if (typeof prebakedClasses === 'string') {
    prebakedClasses = prebakedClasses.split(/[\.\s]+/g);
  }

  // if it's not yet an array, make it one
  if (!Array.isArray(prebakedClasses)) {
    prebakedClasses = [prebakedClasses];
  }

  // add runtime classNames to taste
  return classNames(...prebakedClasses, props.className);
};

export default (Component, prebakedClasses = '') => {
  // classes added and removed here ;-)
  const WrappedComponent = (props) => (
    <Component {...props} className={buildClassName(prebakedClasses, props)} />
  );

  const isReactComponent = (
    typeof Component !== 'string'
  );

  // figure out the component's name
  const componentName = (
    isReactComponent
      ? Component.displayName
      : Component
  );

  // give this wrapper of ours a name
  WrappedComponent.displayName = `Classed(${componentName})`;
  WrappedComponent.propTypes = {
    children: React.PropTypes.node,
    className: React.PropTypes.string
  };

  return WrappedComponent;
};
