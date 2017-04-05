import React from 'react';

import Emoji from '../../lib/Emoji';

class Emojify extends React.PureComponent {
  static propTypes = {
    text: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object
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
