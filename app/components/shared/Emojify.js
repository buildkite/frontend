import React from 'react';
import Emoji from '../../lib/Emoji';

class Emojify extends React.Component {
  static propTypes = {
    text: React.PropTypes.string,
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    return (
      <span className={this.props.className} style={this.props.style} dangerouslySetInnerHTML={{__html: Emoji.parse(this.props.text)}} />
    );
  }
}

export default Emojify;
