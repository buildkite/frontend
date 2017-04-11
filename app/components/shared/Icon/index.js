import React from 'react';
import update from "react-addons-update";

import Logger from '../../../lib/Logger';

const svgContent = ((icon_context) => (
  (name, title) => {
    let icon = icon_context('./placeholder.svg');

    try {
      icon = icon_context(`./${name}.svg`);
    } catch (err) {
      Logger.error(`[Icon] No icon defined for "${name}"`, err);
    }

    return (title ? `<title>${title}</title>` : '') + icon;
  }
))(require.context('!raw-loader!./', false, /\.svg$/));

function Icon(props) {
  const style = update(props.style || {}, {
    fill: {
      $set: "currentColor"
    },
    verticalAlign: {
      $set: "middle"
    }
  });

  return (
    <svg
      viewBox="0 0 20 20"
      width="20px"
      height="20px"
      className={props.className}
      style={style}
      dangerouslySetInnerHTML={{
        __html: svgContent(props.icon, props.title)
      }}
    />
  );
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  title: React.PropTypes.string,
  className: React.PropTypes.string,
  style: React.PropTypes.object
};

export default Icon;
