import React from 'react';
import Emoji from '../../lib/Emoji';

const Emojify = (props) =>
  <span dangerouslySetInnerHTML={{__html: Emoji.parse(props.text)}} />

Emojify.propTypes = {
  text: React.PropTypes.string
};

export default Emojify;
