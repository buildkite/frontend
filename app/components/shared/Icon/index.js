import React from 'react';
import Logger from '../../../lib/Logger';

const titleNode = (props) => {
  if (props.title) {
    return (
      <title>{props.title}</title>
    );
  }
}

const pathNodes = (props) => {
  switch (props.icon) {
	  case 'settings':
                  return require("./settings").default;
	  case 'members':
                  return require("./members").default;
	  case 'notification-services':
                  return require("./notification-services").default;
	  case 'billing':
                  return require("./billing").default;
	  case 'emails':
                  return require("./emails").default;
	  case 'connected-accounts':
                  return require("./connected-accounts").default;
	  case 'api-tokens':
                  return require("./api-tokens").default;
          default:
                  Logger.error(`[Icon] No icon defined for "${props.icon}"`);
                  return require("./placeholder").default;
  }
}

const Icon = (props) => {
  return (
    <svg viewBox="0 0 20 20" width="20px" height="20px" className={props.className} style={{fill: "currentColor", verticalAlign: "middle"}}>
      {titleNode(props)}
      {pathNodes(props)}
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
