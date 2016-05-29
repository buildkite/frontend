import React from 'react';

import Bar from './bar';

const PASSED_COLOR = "#B0DF21";
const RUNNING_COLOR = "#FFBA03";
const FAILED_COLOR = "#F73F23";
const PENDING_COLOR = "#DDDDDD";

const MAXIMUM_NUMBER_OF_BUILDS = 30;

const BAR_HEIGHT = 45;
const BAR_WIDTH = 7;
const BAR_SEPERATOR_WIDTH = 1;

const GRAPH_WIDTH = (BAR_WIDTH * MAXIMUM_NUMBER_OF_BUILDS) + ((MAXIMUM_NUMBER_OF_BUILDS * BAR_SEPERATOR_WIDTH)- 1);

class Graph extends React.Component {
  static propTypes = {
    branch: React.PropTypes.string.isRequired,
    builds: React.PropTypes.shape({
      edges: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          node: React.PropTypes.shape({
            state: React.PropTypes.string.isRequired,
            createdAt: React.PropTypes.string,
            finishedAt: React.PropTypes.string
          }).isRequired
        }).isRequired
      )
    }).isRequired
  };

  render() {
    return (
      <div className="py2" style={{width: GRAPH_WIDTH}}>
        <div className="h6 regular dark-gray mb1">{this.props.branch}</div>
        <div className="overflow-hidden align-bottom relative" style={{height: BAR_HEIGHT}}>{this.renderBars()}</div>
      </div>
    )
  }

  renderBars() {
    let bars = [];

    for (let i = 0; i < MAXIMUM_NUMBER_OF_BUILDS; i++) {
      let buildEdge = this.props.builds.edges[i];

      if(buildEdge) {
        bars.push({ color: PASSED_COLOR, height: "50%" });
      } else {
        bars.push({ color: PENDING_COLOR, height: "2px" });
      }
    }

    return bars.map((bar, index) =>
      <Bar key={index} left={index * (BAR_WIDTH + BAR_SEPERATOR_WIDTH)} color={bar.color} width={BAR_WIDTH} height={bar.height} />
    )
  }
}

export default Graph
