// @flow

import * as React from 'react';
import {createFragmentContainer, graphql} from 'react-relay/compat';
import PropTypes from 'prop-types';
import AnchoredPopover from 'app/components/shared/Popover/anchored';
import BuildState from 'app/components/icons/BuildState';
import BuildTooltip from './BuildTooltip';
import type {Status_pipeline} from './__generated__/Status_pipeline.graphql';

type Props = {
  pipeline: Status_pipeline
};

type State = {
  hover: boolean,
};


class Status extends React.Component<Props,State> {
  static propTypes = {
    pipeline: PropTypes.shape({
      id: PropTypes.string.isRequired,
      builds: PropTypes.shape({
        edges: PropTypes.arrayOf(
          PropTypes.shape({
            node: PropTypes.shape({
              state: PropTypes.string.isRequired,
              url: PropTypes.string.isRequired
            }).isRequired
          }).isRequired
        )
      }).isRequired
    }).isRequired
  };

  state = {
    hover: false
  }

  render() {
    const buildEdge = this.props.pipeline.builds.edges[0];

    if (buildEdge) {
      const build = buildEdge.node;

      return (
        <AnchoredPopover>
          <a
            href={build.url}
            className="color-inherit relative"
            onMouseOver={this.handleMouseOver}
            onMouseOut={this.handleMouseOut}
            width={300}
          >
            <span className="block line-height-1"><BuildState.Regular state={build.state} /></span>
          </a>
          <BuildTooltip build={build} visible={this.state.hover} left={-8} top={44} />
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