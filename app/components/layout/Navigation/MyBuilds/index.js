import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import classNames from 'classnames';
import { hour, seconds } from 'metrick/duration';

import PusherStore from '../../../../stores/PusherStore';
import Button from '../../../shared/Button';
import Spinner from '../../../shared/Spinner';
import Dropdown from '../../../shared/Dropdown';
import Icon from '../../../shared/Icon';
import Badge from '../../../shared/Badge';
import CachedStateWrapper from '../../../../lib/CachedStateWrapper';

import Build from './build';
import DropdownButton from './../dropdown-button';

class MyBuilds extends React.Component {
  static propTypes = {
    viewer: PropTypes.object,
    relay: PropTypes.object.isRequired
  }

  state = {
    isDropdownVisible: false,
    scheduledBuildsCount: this.props.viewer.scheduledBuilds ? this.props.viewer.scheduledBuilds.count : 0,
    runningBuildsCount: this.props.viewer.runningBuilds ? this.props.viewer.runningBuilds.count : 0
  }

  // When the MyBuilds mounts, we should see if we've got any cached
  // builds numbers so we can show something right away.
  componentWillMount() {
    const initialState = {};
    const cachedState = this.getCachedState();

    if (!this.props.viewer.scheduledBuilds) {
      initialState.scheduledBuildsCount = cachedState.scheduledBuildsCount || 0;
    }

    if (!this.props.viewer.runningBuilds) {
      initialState.runningBuildsCount = cachedState.runningBuildsCount || 0;
    }

    this.setState(initialState);
  }

  componentDidMount() {
    PusherStore.on("user_stats:change", this.handlePusherWebsocketEvent);

    // Now that "My Builds" has been mounted on the page and Pusher has
    // connected, we should force a refetch of the latest `scheduledBuilds` and
    // `runningBuilds` counts from GraphQL.
    PusherStore.on("connected", this.handlePusherConnected);

    // If pusher doesn't connect in 3 seconds, just force the callback
    // manually.  This can happen if Pusher is being a bit weird, or when
    // Pusher isn't connected at all (like in the case of automated tests)
    setTimeout(this.handlePusherConnected, 3::seconds);
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
    PusherStore.off("connected", this.handlePusherConnected);
  }

  // As we get new values for scheduledBuildsCount and runningBuildsCount from
  // Relay + GraphQL, we'll be sure to update the cached state with the latest
  // values so when the page re-loads, we can show the latest numbers.
  componentWillReceiveProps(nextProps) {
    if (nextProps.viewer.scheduledBuilds || nextProps.viewer.runningBuilds) {
      this.setCachedState({
        scheduledBuildsCount: nextProps.viewer.scheduledBuilds.count,
        runningBuildsCount: nextProps.viewer.runningBuilds.count
      });
    }
  }

  render() {
    return (
      <Dropdown width={320} className="flex" onToggle={this.handleDropdownToggle}>
        <DropdownButton className={classNames("py0", { "lime": this.state.isDropdownVisible })} onMouseEnter={this.handleButtonMouseEnter}>
          {'My Builds '}
          <div className="xs-hide">
            <CSSTransitionGroup transitionName="transition-appear-pop" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
              {this.renderBadge()}
            </CSSTransitionGroup>
          </div>
          <Icon icon="down-triangle" style={{ width: 7, height: 7, marginLeft: '.5em' }} />
        </DropdownButton>

        {this.renderDropdown()}
      </Dropdown>
    );
  }

  renderBadge() {
    const buildsCount = this.state.runningBuildsCount + this.state.scheduledBuildsCount;

    // Only render the badge if we've actually got a number to show
    if (buildsCount) {
      return (
        <Badge className={classNames("hover-lime-child", { "bg-lime": this.state.isDropdownVisible })}>
          {buildsCount}
        </Badge>
      );
    }
  }

  renderDropdown() {
    // If `builds` here is null, that means that Relay hasn't fetched the data
    // for it yet. It will become an Array once it's loaded.
    if (!this.props.viewer.user.builds) {
      return this.renderSpinner();
    }

    // Once we've got an array of builds, we either show what we have, or the
    // setup instructions.
    if (this.props.viewer.user.builds.edges.length > 0) {
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

  handleDropdownToggle = (visible) => {
    // If `includeBuilds` hasn't been set to `true` yet (perhaps the mouseEnter
    // event never got triggered because we're on a mobile device) trigger a
    // load of the builds as the dropdown opens.
    if (!this.props.relay.variables.includeBuilds) {
      this.props.relay.forceFetch({ includeBuilds: true });
    }

    this.setState({ isDropdownVisible: visible });
  };

  handlePusherConnected = () => {
    if (!this.props.relay.variables.includeBuildCounts) {
      this.props.relay.forceFetch({ includeBuildCounts: true });
    }
  };

  // If the user is hovering over the "My Builds" button, be sneaky and start
  // loading the build data in the background.
  handleButtonMouseEnter = () => {
    if (!this.props.relay.variables.includeBuilds) {
      this.props.relay.forceFetch({ includeBuilds: true });
    }
  };

  // When we recieve a Pusher event, check to see if the build counts have
  // changed (meaning a new build has probably started or finished). In that
  // case, we'll perform a full refersh of the My Builds data (including new
  // numbers for the nav and the builds themselves).
  //
  // We don't use the data from the payload otherwise the UI would update, and
  // then the builds would update a few moments later when the GraphQL query
  // finishes, which would be a bit weird.
  handlePusherWebsocketEvent = (payload) => {
    const scheduledBuildsCountChanged = this.state.scheduledBuildsCount !== payload.scheduledBuildsCount;
    const runningBuildsCountChanged = this.state.runningBuildsCount !== payload.runningBuildsCount;

    if (scheduledBuildsCountChanged || runningBuildsCountChanged) {
      this.props.relay.forceFetch();
    }
  };
}

// Wrap the MyBuilds in a CachedStateWrapper so we get access to methods
// like `setCachedState`
const CachedMyBuilds = CachedStateWrapper(MyBuilds, { validLength: 1::hour });

export default Relay.createContainer(CachedMyBuilds, {
  initialVariables: {
    includeBuilds: false,
    includeBuildCounts: false
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        user {
          builds(first: 5) @include(if: $includeBuilds) {
            edges {
              node {
                id
                ${Build.getFragment('build')}
              }
            }
          }
        }
        runningBuilds: builds(state: RUNNING) @include(if: $includeBuildCounts) {
          count
        }
        scheduledBuilds: builds(state: SCHEDULED) @include(if: $includeBuildCounts) {
          count
        }
      }
    `
  }
});
