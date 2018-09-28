/* global module */

import React from 'react';
import { storiesOf } from '@storybook/react';

import Favorite from '../app/components/icons/Favorite';

// Make a real button so we can test what it's like
class FavoriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { favorited: false };
  }
  shouldComponentUpdate() { return true; }
  render() {
    return (
      <button className="btn p0 dark-gray line-height-1" onClick={this.handleClick}>
        <Favorite favorite={this.state.favorited} />
      </button>
    );
  }
  handleClick = () => {
    this.setState({ favorited: !this.state.favorited });
  }
}

storiesOf('Icons', module)
  .add('Favorite', () => (
    <div>
      <div>
        <Favorite favorite={true} />
        <Favorite favorite={false} />
      </div>
      <FavoriteButton />
    </div>
  ));