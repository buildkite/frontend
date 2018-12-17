// @flow

import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import svgContent from './svgContent';

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
