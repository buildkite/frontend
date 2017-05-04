import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import moment from 'moment';
import classNames from 'classnames';
import { second } from 'metrick/duration';

import Bar from './bar';

import { buildTime } from '../../../lib/builds';

import BuildStates from '../../../constants/BuildStates';

import { MAXIMUM_NUMBER_OF_BUILDS, BAR_WIDTH_WITH_SEPERATOR, GRAPH_HEIGHT, GRAPH_WIDTH } from './constants';

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
const SKIPPED_COLOR = "#83B0E4";
const SKIPPED_COLOR_HOVER = "#3769A2";
const NOT_RUN_COLOR = SKIPPED_COLOR;
const NOT_RUN_COLOR_HOVER = SKIPPED_COLOR_HOVER;

class Graph extends React.Component {
  static propTypes = {
    pipeline: PropTypes.shape({
      id: PropTypes.string.isRequired,
      builds: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              state: PropTypes.string.isRequired,
              url: PropTypes.string.isRequired,
              startedAt: PropTypes.string,
              finishedAt: PropTypes.string,
              canceledAt: PropTypes.string,
              scheduledAt: PropTypes.string
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

  state = {
    showFullGraph: false
  };

  componentDidMount() {
    this.toggleRenderInterval(this.props.pipeline.builds.edges);

    // As soon as the graph has mounted, animate the bars growing into view.
    setTimeout(() => {
      this.setState({ showFullGraph: true });
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
    const classes = classNames("relative", {
      "animation-disable": this._shifting
    });

    return (
      <div style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }} className={classes}>
        {this.renderBars()}
      </div>
    );
  }

  renderBars() {
    const bars = [];

    // `maximumDuration` is wrapped in an object so it's passed by
    // reference, which means all bars get the final, correct value
    // despite the generating loop only occuring once
    const graphProps = {
      maximumDuration: 1 // starts as 1 to avoid a `0/0` when we calculate percentages
    };

    for (let buildIndex = 0; buildIndex < MAXIMUM_NUMBER_OF_BUILDS; buildIndex++) {
      const index = MAXIMUM_NUMBER_OF_BUILDS - buildIndex - 1;
      const buildEdge = this.props.pipeline.builds.edges[buildIndex];

      if (buildEdge) {
        const { from, to } = buildTime(buildEdge.node);
        const duration = moment(to).diff(moment(from));

        if (duration > graphProps.maximumDuration) {
          graphProps.maximumDuration = duration;
        }

        bars[index] = (
          <Bar
            key={index}
            color={this.colorForBuild(buildEdge.node)}
            hoverColor={this.hoverColorForBuild(buildEdge.node)}
            duration={duration}
            href={buildEdge.node.url}
            build={buildEdge.node}
            left={index * BAR_WIDTH_WITH_SEPERATOR}
            width={BAR_WIDTH_WITH_SEPERATOR}
            graph={graphProps}
            showFullGraph={this.state.showFullGraph}
          />
        );
      } else {
        bars[index] = (
          <Bar
            key={index}
            color={PENDING_COLOR}
            hoverColor={PENDING_COLOR_HOVER}
            duration={0}
            build={null}
            left={index * BAR_WIDTH_WITH_SEPERATOR}
            width={BAR_WIDTH_WITH_SEPERATOR}
            graph={graphProps}
            showFullGraph={this.state.showFullGraph}
          />
        );
      }
    }

    return bars;
  }

  colorForBuild(build) {
    if (build.state === BuildStates.SCHEDULED) {
      return SCHEDULED_COLOR;
    } else if (build.state === BuildStates.RUNNING) {
      return RUNNING_COLOR;
    } else if (build.state === BuildStates.PASSED || build.state === BuildStates.BLOCKED) {
      return PASSED_COLOR;
    } else if (build.state === BuildStates.SKIPPED) {
      return SKIPPED_COLOR;
    } else if (build.state === BuildStates.NOT_RUN) {
      return NOT_RUN_COLOR;
    } else {
      return FAILED_COLOR;
    }
  }

  hoverColorForBuild(build) {
    if (build.state === BuildStates.SCHEDULED) {
      return SCHEDULED_COLOR_HOVER;
    } else if (build.state === BuildStates.RUNNING) {
      return RUNNING_COLOR_HOVER;
    } else if (build.state === BuildStates.PASSED || build.state === BuildStates.BLOCKED) {
      return PASSED_COLOR_HOVER;
    } else if (build.state === BuildStates.SKIPPED) {
      return SKIPPED_COLOR_HOVER;
    } else if (build.state === BuildStates.NOT_RUN) {
      return NOT_RUN_COLOR_HOVER;
    } else {
      return FAILED_COLOR_HOVER;
    }
  }

  toggleRenderInterval(buildEdges) {
    // See if there is a build running
    let running = false;
    for (const edge of buildEdges) {
      if (edge.node.state === BuildStates.RUNNING) {
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
        }, 1::second);
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
        builds(first: 30, branch: "%default", state: [ SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED ]) {
          edges {
            node {
              id
              state
              url
              startedAt
              finishedAt
              canceledAt
              scheduledAt
              ${Bar.getFragment('build')}
            }
          }
        }
      }
    `
  }
});
