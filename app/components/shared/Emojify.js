import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Emoji from '../../lib/Emoji';

class Emojify extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

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
