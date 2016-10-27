import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import Emoji from '../../lib/Emoji';

class Emojify extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    className: React.PropTypes.string
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <span
        className={this.props.className}
        title={this.props.text}
        dangerouslySetInnerHTML={{ __html: Emoji.parse(this.props.text) }}
      />
    );
  }
}

export default Emojify;
