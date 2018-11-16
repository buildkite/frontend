// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { buildTime } from 'app/lib/builds';
import BuildStates from 'app/constants/BuildStates';
import Bar from './Bar';
import { MAXIMUM_NUMBER_OF_BUILDS, BAR_WIDTH_WITH_SEPERATOR, GRAPH_HEIGHT, GRAPH_WIDTH } from './constants';
import type { Graph_pipeline } from './__generated__/Graph_pipeline.graphql';

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

type Props = {
  pipeline: Graph_pipeline
};

type State = {
  showFullGraph: boolean
};

class Graph extends React.Component<Props, State> {
  _shifting: boolean;
  _interval: IntervalID;

  state = {
    showFullGraph: false
  };

  get buildsEdges() {
    if (this.props.pipeline.builds && this.props.pipeline.builds.edges) {
      return this.props.pipeline.builds.edges;
    }
    return [];
  }

  componentDidMount() {
    if (this.buildsEdges.length) {
      this.toggleRenderInterval(this.buildsEdges);
    }

    // As soon as the graph has mounted, animate the bars growing into view.
    setTimeout(() => { this.setState({ showFullGraph: true }); }, 0);
  }

  componentWillReceiveProps(nextProps) {
    const { builds } = this.props.pipeline;
    const { builds: nextBuilds } = nextProps.pipeline;

    if (builds && builds.edges && nextBuilds && nextBuilds.edges) {
      const build = builds.edges[0];
      const nextBuild = nextBuilds.edges[0];

      // Set `shifting` if all the builds are being moved due to a new one coming in.
      if ((build && build.node && nextBuild && nextBuild.node) && build.node.id !== nextBuild.node.id) {
        this._shifting = true;
      }
    }
  }

  componentWillUnmount() {
    if (this._interval) {
      clearInterval(this._interval);
      delete this._interval;
    }
  }

  componentDidUpdate() {
    if (this.props.pipeline.builds && this.props.pipeline.builds.edges) {
      this.toggleRenderInterval(this.props.pipeline.builds.edges);
    }

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
    if (this.buildsEdges.length === 0) {
      return null;
    }

    // `maximumDuration` is wrapped in an object so it's passed by
    // reference, which means all bars get the final, correct value
    // despite the generating loop only occuring once
    const graphProps = {
      maximumDuration: 1 // starts as 1 to avoid a `0/0` when we calculate percentages
    };

    return Array.from(Array(MAXIMUM_NUMBER_OF_BUILDS).keys(), (bar) => {
      const index = MAXIMUM_NUMBER_OF_BUILDS - bar - 1;
      const buildEdge = this.buildsEdges[index];

      if (buildEdge && buildEdge.node) {
        const { node } = buildEdge;
        const { from, to } = buildTime(node);
        const duration = moment(to).diff(moment(from));

        if (duration > graphProps.maximumDuration) {
          graphProps.maximumDuration = duration;
        }

        return (
          <Bar
            key={bar}
            color={this.colorForBuild(node)}
            hoverColor={this.hoverColorForBuild(node)}
            duration={duration}
            href={node.url}
            build={node}
            left={bar * BAR_WIDTH_WITH_SEPERATOR}
            width={BAR_WIDTH_WITH_SEPERATOR}
            graph={graphProps}
            showFullGraph={this.state.showFullGraph}
          />
        );
      }

      return (
        <Bar
          key={bar}
          color={PENDING_COLOR}
          hoverColor={PENDING_COLOR_HOVER}
          duration={0}
          build={null}
          left={bar * BAR_WIDTH_WITH_SEPERATOR}
          width={BAR_WIDTH_WITH_SEPERATOR}
          graph={graphProps}
          showFullGraph={this.state.showFullGraph}
        />
      );
    });
  }

  colorForBuild(build) {
    switch (build.state) {
      case BuildStates.SCHEDULED: return SCHEDULED_COLOR;
      case BuildStates.RUNNING: return SCHEDULED_COLOR;
      case BuildStates.PASSED: return PASSED_COLOR;
      case BuildStates.BLOCKED: return PASSED_COLOR;
      case BuildStates.SKIPPED: return SKIPPED_COLOR;
      case BuildStates.NOT_RUN: return NOT_RUN_COLOR;
      default: return FAILED_COLOR;
    }
  }

  hoverColorForBuild(build) {
    switch (build.state) {
      case BuildStates.SCHEDULED: return SCHEDULED_COLOR_HOVER;
      case BuildStates.RUNNING: return SCHEDULED_COLOR_HOVER;
      case BuildStates.PASSED: return PASSED_COLOR_HOVER;
      case BuildStates.BLOCKED: return PASSED_COLOR_HOVER;
      case BuildStates.SKIPPED: return SKIPPED_COLOR_HOVER;
      case BuildStates.NOT_RUN: return NOT_RUN_COLOR_HOVER;
      default: return FAILED_COLOR_HOVER;
    }
  }

  toggleRenderInterval(buildEdges) {
    // See if there is a build running
    let running = false;
    for (const edge of buildEdges) {
      if (edge && edge.node && edge.node.state === BuildStates.RUNNING) {
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
        this._interval = setInterval(() => { this.forceUpdate(); }, 1);
      }
    } else {
      // Clear the interval now that nothing is running
      if (this._interval) {
        clearInterval(this._interval);
        delete this._interval;
      }
    }
  }
}

export default createFragmentContainer(Graph, graphql`
  fragment Graph_pipeline on Pipeline @argumentDefinitions(
    includeGraphData: {type: "Boolean!"},
  ) {
    builds(
      first: 30,
      branch: "%default",
      state: [ SCHEDULED, RUNNING, PASSED, FAILED, CANCELED, CANCELING, BLOCKED ]
    ) @include(if: $includeGraphData) {
      edges {
        node {
          id
          state
          url
          startedAt
          finishedAt
          canceledAt
          scheduledAt
          ...Bar_build
        }
      }
    }
  }
`);