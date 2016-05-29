import React from 'react';
import moment from 'moment';

import Bar from './bar';

const PASSED_COLOR = "#B0DF21";
const RUNNING_COLOR = "#FFBA03";
const FAILED_COLOR = "#F73F23";
const PENDING_COLOR = "#DDDDDD";

const MAXIMUM_NUMBER_OF_BUILDS = 30;

const BAR_HEIGHT_MINIMUM = 3;
const BAR_WIDTH = 7;
const BAR_SEPERATOR_WIDTH = 1;
const BAR_WIDTH_WITH_SEPERATOR = BAR_WIDTH + BAR_SEPERATOR_WIDTH;

const GRAPH_HEIGHT = 45;
const GRAPH_WIDTH = (BAR_WIDTH * MAXIMUM_NUMBER_OF_BUILDS) + ((MAXIMUM_NUMBER_OF_BUILDS * BAR_SEPERATOR_WIDTH)- 1);

class Graph extends React.Component {
  static propTypes = {
    branch: React.PropTypes.string.isRequired,
    builds: React.PropTypes.shape({
      edges: React.PropTypes.arrayOf(
        React.PropTypes.shape({
          node: React.PropTypes.shape({
            state: React.PropTypes.oneOf([ "running", "passed", "failed", "canceled", "canceling" ]).isRequired,
            startedAt: React.PropTypes.string,
            finishedAt: React.PropTypes.string,
            url: React.PropTypes.string.isRequired
          }).isRequired
        }).isRequired
      )
    }).isRequired
  };

  render() {
    return (
      <div className="py2" style={{width: GRAPH_WIDTH}}>
        <div className="h6 regular dark-gray mb1">{this.props.branch}</div>
        <div className="overflow-hidden align-bottom relative" style={{height: GRAPH_HEIGHT}}>{this.renderBars()}</div>
      </div>
    )
  }

  renderBars() {
    let bars = [];
    let maximumDuration = 1; // 1 to avoid a `0/0` when we calculate percentages

    for (let i = 0; i < MAXIMUM_NUMBER_OF_BUILDS; i++) {
      let buildEdge = this.props.builds.edges[i];

      if(buildEdge) {
        let duration = this.durationForBuild(buildEdge.node);
        if(duration > maximumDuration) maximumDuration = duration;

        bars.push({ color: this.colorForBuild(buildEdge.node), duration: duration, href: buildEdge.node.url });
      } else {
        bars.push({ color: PENDING_COLOR, duration: 0 });
      }
    }

    return bars.map((bar, index) => {
      let left = index * BAR_WIDTH_WITH_SEPERATOR;

      let height = (bar.duration / maximumDuration) * GRAPH_HEIGHT;
      if(height < BAR_HEIGHT_MINIMUM) height = BAR_HEIGHT_MINIMUM;

      return <Bar key={index} left={left} color={bar.color} width={BAR_WIDTH} height={height} href={bar.href} />
    })
  }

  durationForBuild(build) {
    if(build.startedAt) {
      // Passing `null` to moment will result in a blank moment instance, so if
      // there isn't a finishedAt, just switch to undefined.
      return moment(build.finishedAt || undefined).diff(moment(build.startedAt));
    } else {
      return 0;
    }
  }

  colorForBuild(build) {
    if(build.state == "running") {
      return RUNNING_COLOR;
    } else if (build.state == "passed" ) {
      return PASSED_COLOR;
    } else {
      return FAILED_COLOR;
    }
  }
}

export default Graph
