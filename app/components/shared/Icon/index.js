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

class Icon extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    className: React.PropTypes.string
  };

  render() {
    return (
      <svg viewBox="0 0 20 20" width="20px" height="20px" className={this.props.className} style={{fill: "currentColor", verticalAlign: "middle"}}>
        {titleNode(this.props.title)}
        {pathNodes(this.props.icon)}
      </svg>
    );
  }
}

export default Icon;
