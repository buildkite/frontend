import React from 'react';
import styled from 'styled-components';

const starColor = "#f8cc1c";

const StarSVG = styled.svg`
  .star {
    fill: ${(props) => props.favorite ? starColor : 'none'};
    fill-opacity: 0.3;
    fill-rule: evenodd;
    stroke: ${(props) => props.favorite ? starColor : 'currentColor'};
    stroke-width: 1px;
  }

  &:hover .star {
    fill: ${(props) => props.favorite ? 'none' : starColor};
    stroke: ${starColor};
  }
`;

class Favorite extends React.Component {
  static propTypes = {
    favorite: React.PropTypes.bool.isRequired
  };

  render() {
    return (
      <StarSVG width="20px" height="15px" viewBox="0 0 16 15" favorite={this.props.favorite}>
        <title>Favorite</title>
        <g className="star" transform="translate(-1103, -19)">
          <polygon points="1111 31 1106.29772 33.472136 1107.19577 28.236068 1103.39155 24.527864 1108.64886 23.763932 1111 19 1113.35114 23.763932 1118.60845 24.527864 1114.80423 28.236068 1115.70228 33.472136" />
        </g>
      </StarSVG>
    );
  }
}

export default Favorite;
