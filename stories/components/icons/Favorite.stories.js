/* global module */

import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

import Favorite from '../../../app/components/icons/Favorite';

// Make a real button so we can test what it's really like
class FavoriteButton extends React.Component {
  static propTypes = {
    favorited: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { favorited: props.favorited };
  }
  shouldComponentUpdate() { return true; }
  render() {
    return (
      <button className="btn p0 dark-gray line-height-0" onClick={this.handleClick}>
        <Favorite favorite={this.state.favorited} />
      </button>
    );
  }
  handleClick = () => {
    this.setState({ favorited: !this.state.favorited });
  }
}

storiesOf('Icons', module)
  .add('Favorite', () => <FavoriteButton favorited={true} />);

export const Sketch = () => (
  <div>
    <span data-sketch-symbol="Icons/Favorite/On"><FavoriteButton favorited={true} /></span>
    <span data-sketch-symbol="Icons/Favorite/Off"><FavoriteButton favorited={false} /></span>
  </div>
);