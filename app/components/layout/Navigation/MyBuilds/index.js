import React from 'react';
import Relay from 'react-relay';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';

import PusherStore from '../../../../stores/PusherStore';
import Button from '../../../shared/Button';
import Spinner from '../../../shared/Spinner';
import Dropdown from '../../../shared/Dropdown';
import Icon from '../../../shared/Icon';
import Badge from '../../../shared/Badge';
import CachedStateWrapper from '../../../../lib/CachedStateWrapper';

import Build from './build';
import DropdownButton from './../dropdown-button';

class BuildsDropdown extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object,
    relay: React.PropTypes.object.isRequired
  }

  state = {
    fetching: true,
    showing: false,
    scheduledBuildsCount: this.props.viewer.scheduledBuilds ? this.props.viewer.scheduledBuilds.count : 0,
    runningBuildsCount: this.props.viewer.runningBuilds ? this.props.viewer.runningBuilds.count : 0
  }

  componentWillMount() {
    const initialState = {};
    const cachedState = this.getCachedState();

    if (!this.props.viewer.scheduledBuilds) {
      initialState.scheduledBuildsCount = cachedState.scheduledBuildsCount || 0;
    }

    if (!this.props.viewer.runningBuilds) {
      initialState.runningBuildsCount = cachedState.runningBuildsCount || 0;
    }

    if (Object.keys(initialState).length) {
      this.setState(initialState);
    }
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);

    this.props.relay.forceFetch({ isMounted: true }, (readyState) => {
      // Now that we've got the data, turn off the spinner
      if (readyState.done) {
        this.setState({ fetching: false });
      }
    });
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.viewer.scheduledBuilds || nextProps.viewer.runningBuilds) {
      this.setCachedState({
        scheduledBuildsCount: nextProps.viewer.scheduledBuilds.count,
        runningBuildsCount: nextProps.viewer.runningBuilds.count
      });
    }
  };

  render() {
    const buildsCount = this.state.runningBuildsCount + this.state.scheduledBuildsCount;
    let badge;

    if (buildsCount) {
      badge = (
        <Badge className={classNames("hover-lime-child", { "bg-lime": this.state.showingDropdown })}>
          {buildsCount}
        </Badge>
      );
    }

    return (
      <Dropdown width={320} className="flex" onToggle={this.handleBuildsDropdownToggle}>
        <DropdownButton className={classNames("py0", { "lime": this.state.showingDropdown })}>
          {'My Builds '}
          <div className="xs-hide">
            <ReactCSSTransitionGroup transitionName="transition-appear-pop" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
              {badge}
            </ReactCSSTransitionGroup>
          </div>
          <Icon icon="down-triangle" style={{ width: 7, height: 7, marginLeft: '.5em' }} />
        </DropdownButton>

        {this.renderDropdown()}
      </Dropdown>
    );
  }

  renderDropdown() {
    if (this.state.fetching) {
      return this.renderSpinner();
    } else if (this.props.viewer.user.builds.edges.length > 0) {
      return this.renderBuilds();
    } else {
      return this.renderSetupInstructions();
    }
  }

  renderBuilds() {
    return (
      <div>
        <div className="px3 py2">
          {this.props.viewer.user.builds.edges.map((edge) => <Build key={edge.node.id} build={edge.node} />)}
        </div>
        <div className="pb2 px3">
          <Button href="/builds" theme="default" outline={true} className="center" style={{ width: "100%" }}>More Builds</Button>
        </div>
      </div>
    );
  }

  renderSetupInstructions() {
    return (
      <div className="px3 py2">
        <div className="mb2">To have your builds appear here, make sure that your commit email address (e.g. <code className="border border-gray dark-gray" style={{ padding: '.1em .3em' }}>git config user.email</code>) is added and verified in your list of personal email addresses.</div>
        <Button href="/user/emails" theme="default" outline={true} className="center" style={{ width: "100%" }}>Update Email Addresses</Button>
      </div>
    );
  }

  renderSpinner() {
    return (
      <div className="px3 py2 center">
        <Spinner />
      </div>
    );
  }

  handleBuildsDropdownToggle = (visible) => {
    this.setState({ showingDropdown: visible });
  };

  handlePusherWebsocketEvent = (payload) => {
    // Only do a relay update of the builds count changes
    if (this._buildsCount !== payload.buildsCount) {
      this.props.relay.forceFetch();
    }

    // Save the new builds count
    this._buildsCount = payload.buildsCount;

    this.setCachedState({
      scheduledBuildsCount: payload.scheduledBuildsCount,
      runningBuildsCount: payload.runningBuildsCount
    });
  };
}

export default Relay.createContainer(
  CachedStateWrapper(
    BuildsDropdown,
    { validLength: 60 * 60 * 1000 /* 1 hour */ }
  ),
  {
    initialVariables: {
      isMounted: false
    },

    fragments: {
      viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          builds(first: 5) @include(if: $isMounted) {
            edges {
              node {
                id
                ${Build.getFragment('build')}
              }
            }
          }
        }
        runningBuilds: builds(state: BUILD_STATE_RUNNING) @include(if: $isMounted) {
          count
        }
        scheduledBuilds: builds(state: BUILD_STATE_SCHEDULED) @include(if: $isMounted) {
          count
        }
      }
    `
    }
  }
);
