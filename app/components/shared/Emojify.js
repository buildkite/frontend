import React from 'react';
import PropTypes from 'prop-types';

import Emoji from '../../lib/Emoji';

class Emojify extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  };

  render() {
    const { className, text, style } = this.props;

    return (
      <span
        className={className}
        style={style}
        title={text}
        dangerouslySetInnerHTML={{ __html: Emoji.parse(text) }}
      />
    );
  }
}

export default Emojify;
