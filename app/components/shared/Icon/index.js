import React from 'react';
import update from "react-addons-update";

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
    case 'github':
      return require("./github").default;
    case 'twitter':
      return require("./twitter").default;
    case 'chevron-right':
      return require("./chevron-right").default;
    case 'teams':
      return require("./teams").default;
    case 'circle':
      return require("./circle").default;
    case 'plus-circle':
      return require("./plus-circle").default;
    case 'search':
      return require("./search").default;
    default:
      Logger.error(`[Icon] No icon defined for "${icon}"`);
      return require("./placeholder").default;
  }
}

class Icon extends React.Component {
  static propTypes = {
    icon: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    let style = update(this.props.style || {}, {
      fill: {
        $set: "currentColor"
      },
      verticalAlign: {
        $set: "middle"
      }
    });

    return (
      <svg viewBox="0 0 20 20" width="20px" height="20px" className={this.props.className} style={style}>
        {titleNode(this.props.title)}
        {pathNodes(this.props.icon)}
      </svg>
    );
  }
}

export default Icon;
