import React from 'react';
import Logger from '../../../lib/Logger';

const titleNode = (title) => {
  if (title) {
    return (
      <title>{title}</title>
    );
  }
}

const pathNodes = (icon) => {
  switch (icon) {
    case 'settings':
      return require("./settings").default;
    case 'users':
      return require("./users").default;
    case 'notification-services':
      return require("./notification-services").default;
    case 'billing':
      return require("./billing").default;
    case 'emails':
      return require("./emails").default;
    case 'connected-apps':
      return require("./connected-apps").default;
    case 'api-tokens':
      return require("./api-tokens").default;
    default:
      Logger.error(`[Icon] No icon defined for "${icon}"`);
      return require("./placeholder").default;
  }
}

const Icon = (props) => {
  return (
    <svg viewBox="0 0 20 20" width="20px" height="20px" className={props.className} style={{fill: "currentColor", verticalAlign: "middle"}}>
      {titleNode(props.title)}
      {pathNodes(props.icon)}
    </svg>
  );
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  className: React.PropTypes.string
};

Icon.displayName = "Icon";

export default Icon;
