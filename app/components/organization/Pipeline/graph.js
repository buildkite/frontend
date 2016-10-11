import React from 'react';
import Relay from 'react-relay';
import moment from 'moment';
import classNames from 'classnames';

import Bar from './bar';
import BuildTooltip from './build-tooltip';

const PASSED_COLOR = "#B0DF21";
const PASSED_COLOR_HOVER = "#669611";
const RUNNING_COLOR = "#FFBA03";
const RUNNING_COLOR_HOVER = "#DE8F0C";
const FAILED_COLOR = "#F83F23";
const FAILED_COLOR_HOVER = "#AA0A12";
const SCHEDULED_COLOR = "#BBB";
const SCHEDULED_COLOR_HOVER = "#888";
const PENDING_COLOR = "#DDD";
const PENDING_COLOR_HOVER = "#DDD";

const MAXIMUM_NUMBER_OF_BUILDS = 30;

const BAR_HEIGHT_MINIMUM = 3;
const BAR_WIDTH = 7;
const BAR_SEPERATOR_WIDTH = 1;
const BAR_WIDTH_WITH_SEPERATOR = BAR_WIDTH + BAR_SEPERATOR_WIDTH;

const GRAPH_HEIGHT = 35;
const GRAPH_WIDTH = (BAR_WIDTH * MAXIMUM_NUMBER_OF_BUILDS) + ((MAXIMUM_NUMBER_OF_BUILDS * BAR_SEPERATOR_WIDTH) - 1);

class Graph extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      builds: React.PropTypes.shape({
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.shape({
              state: React.PropTypes.string.isRequired,
              url: React.PropTypes.string.isRequired,
              startedAt: React.PropTypes.string,
              finishedAt: React.PropTypes.string
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

  state = {
    height: 0
  }

  componentDidMount() {
    this.toggleRenderInterval(this.props.pipeline.builds.edges);

    // As soon as the graph has mounted, set the height back to 100% to animate
    // the bars growing into view.
    setTimeout(() => {
      this.setState({ height: "100%" });
    }, 0);
  }

  componentWillReceiveProps(nextProps) {
    const thisLatestBuild = this.props.pipeline.builds.edges[0];
    const nextLatestBuild = nextProps.pipeline.builds.edges[0];

    // Set `shifting` if all the builds are being moved due to a new one coming in.
    if ((thisLatestBuild && nextLatestBuild) && thisLatestBuild.node.id !== nextLatestBuild.node.id) {
      this._shifting = true;
    }
  }

  componentDidUpdate() {
    this.toggleRenderInterval(this.props.pipeline.builds.edges);

    delete this._shifting;
  }

  render() {
    const classes = classNames("animation-height align-bottom relative absolute", {
      "animation-disable": this._shifting
    });

    return (
      <div style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }} className="relative">
        <div style={{ height: this.state.height, bottom: 0 }} className={classes}>
          {this.renderBars()}
        </div>
      </div>
    );
  }

  renderBars() {
    const bars = [];
    let maximumDuration = 1; // 1 to avoid a `0/0` when we calculate percentages

    for (let buildIndex = 0; buildIndex < MAXIMUM_NUMBER_OF_BUILDS; buildIndex++) {
      const buildEdge = this.props.pipeline.builds.edges[buildIndex];

      if (buildEdge) {
        const duration = this.durationForBuild(buildEdge.node);
        if (duration > maximumDuration) {maximumDuration = duration;}

        bars[MAXIMUM_NUMBER_OF_BUILDS - buildIndex - 1] = { color: this.colorForBuild(buildEdge.node), hoverColor: this.hoverColorForBuild(buildEdge.node), duration: duration, href: buildEdge.node.url, build: buildEdge.node };
      } else {
        bars[MAXIMUM_NUMBER_OF_BUILDS - buildIndex - 1] = { color: PENDING_COLOR, hoverColor: PENDING_COLOR_HOVER, duration: 0 };
      }
    }

    return bars.map((bar, index) => {
      const left = index * BAR_WIDTH_WITH_SEPERATOR;

      // Calcualte what percentage this bar is in relation to the longest
      // running build
      let height = (bar.duration / maximumDuration);

      // See if the height is less than our minimum. If it is, set a hard pixel
      // height, otherwise make the height a percentage. We use percentages so
      // we can animate the height of the graph as it loads in.
      let heightInPixels = (height * GRAPH_HEIGHT);
      if (heightInPixels < BAR_HEIGHT_MINIMUM) {
        height = BAR_HEIGHT_MINIMUM;
      } else {
        height = (height * 100) + "%";
      }

      return <Bar key={index} left={left} color={bar.color} hoverColor={bar.hoverColor} width={BAR_WIDTH_WITH_SEPERATOR} height={height} href={bar.href} build={bar.build || null} />;
    });
  }

  durationForBuild(build) {
    if (build.startedAt) {
      // Passing `null` to moment will result in a blank moment instance, so if
      // there isn't a finishedAt, just switch to undefined.
      return moment(build.finishedAt || undefined).diff(moment(build.startedAt));
    } else {
      return 0;
    }
  }

  colorForBuild(build) {
    if (build.state === "scheduled") {
      return SCHEDULED_COLOR;
    } else if (build.state === "running") {
      return RUNNING_COLOR;
    } else if (build.state === "passed" || build.state == "blocked") {
      return PASSED_COLOR;
    } else {
      return FAILED_COLOR;
    }
  }

  hoverColorForBuild(build) {
    if (build.state === "scheduled") {
      return SCHEDULED_COLOR_HOVER;
    } else if (build.state === "running") {
      return RUNNING_COLOR_HOVER;
    } else if (build.state === "passed" || build.state == "blocked") {
      return PASSED_COLOR_HOVER;
    } else {
      return FAILED_COLOR_HOVER;
    }
  }

  toggleRenderInterval(buildEdges) {
    // See if there is a build running
    let running = false;
    for (const edge of buildEdges) {
      if (edge.node.state === "running") {
        running = true;
        break;
      }
    }

    // If a build is running, ensure we have an interval setup that re-renders
    // the graph every second.
    if (running) {
      if (this._interval) {
        // no-op, interval already running
      } else {
        this._interval = setInterval(() => {
          this.forceUpdate();
        }, 1000);
      }
    } else {
      // Clear the interval now that nothing is running
      if (this._interval) {
        clearTimeout(this._interval);
        delete this._interval;
      }
    }
  }
}

export default Relay.createContainer(Graph, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        id
        builds(first: 30, branch: "%default", state: [ BUILD_STATE_SCHEDULED, BUILD_STATE_RUNNING, BUILD_STATE_PASSED, BUILD_STATE_FAILED, BUILD_STATE_CANCELED, BUILD_STATE_CANCELING, BUILD_STATE_BLOCKED ]) {
          edges {
            node {
              id
              state
              url
              startedAt
              finishedAt
              ${BuildTooltip.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
