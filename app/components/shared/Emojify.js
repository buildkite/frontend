import React from 'react';
import Emoji from '../../lib/Emoji';

class Emojify extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    className: React.PropTypes.string
  };

  render() {
    return (
      <span className={this.props.className} dangerouslySetInnerHTML={{ __html: Emoji.parse(this.props.text) }} />
    );
  }
}

export default Emojify;
