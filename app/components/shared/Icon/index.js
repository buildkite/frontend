// @flow

import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import escape from 'escape-html';

import Logger from '../../../lib/Logger';

const svgContent = ((icon_context) => (
  (name, title) => {
    let icon = icon_context('./placeholder.svg');

    try {
      icon = icon_context(`./${name}.svg`);
    } catch (err) {
      Logger.error(`[Icon] No icon defined for "${name}"`, err);
    }

    return (title ? `<title>${escape(title)}</title>` : '') + icon;
  }
))(
  // NOTE: We cast `require` to an Object here so we can call `context`,
  //       as Flow doesn't understand Webpack's require extensions.
  (require: Object).context('!raw-loader!./', false, /\.svg$/)
);

type Props = {
  style?: Object,
  className?: string,
  icon: string,
  title?: string
};

function Icon(props: Props) {
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
  icon: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object
};

export default Icon;
