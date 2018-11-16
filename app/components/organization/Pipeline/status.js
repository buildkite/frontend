// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import get from 'lodash.get';
import AnchoredPopover from 'app/components/shared/Popover/anchored';
import BuildState from 'app/components/icons/BuildState';
import BuildTooltip from './BuildTooltip';
import type { Status_pipeline } from './__generated__/Status_pipeline.graphql';

type Props = {
  pipeline: Status_pipeline
};

type State = {
  hover: boolean
};


class Status extends React.Component<Props, State> {
  state = {
    hover: false
  }

  get buildsEdges() {
    if (this.props.pipeline.builds && this.props.pipeline.builds.edges) {
      return this.props.pipeline.builds.edges;
    }
    return [];
  }

  get mostRecentBuild() {
    const builds = this.buildsEdges;
    if (builds && builds[0] && builds[0].node) {
      return builds[0].node;
    }
  }

  render() {
    const mostRecentBuild = this.mostRecentBuild;
    if (mostRecentBuild) {
      return (
        <AnchoredPopover>
          <a
            href={mostRecentBuild.url}
            className="color-inherit relative"
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            width={300}
          >
            <span className="block line-height-1"><BuildState.Regular state={mostRecentBuild.state} /></span>
          </a>
          <BuildTooltip
            build={mostRecentBuild}
            visible={this.state.hover}
            left={-8}
            top={44}
          />
        </AnchoredPopover>
      );
    }

    return (
      <BuildState.Regular state={null} />
    );
  }

  handleMouseOver = () => {
    this.setState({ hover: true });
  }

  handleMouseOut = () => {
    this.setState({ hover: false });
  }
}

export default createFragmentContainer(Status, graphql`
  fragment Status_pipeline on Pipeline {
    id
    builds(first: 1, branch: "%default", state: [ RUNNING, CANCELING, PASSED, FAILED, CANCELED, BLOCKED ]) {
      edges {
        node {
          state
          url
          ...BuildTooltip_build
        }
      }
    }
  }
`);