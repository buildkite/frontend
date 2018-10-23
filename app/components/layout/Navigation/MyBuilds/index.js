// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { hour, seconds } from 'metrick/duration';

import PusherStore from '../../../../stores/PusherStore';
import Button from '../../../shared/Button';
import Spinner from '../../../shared/Spinner';
import Dropdown from '../../../shared/Dropdown';
import Icon from '../../../shared/Icon';
import Badge from '../../../shared/Badge';

import Build from './build';
import DropdownButton from './../dropdown-button';

type ViewerPartial = {
  scheduledBuilds: {
    count: number
  },
  runningBuilds: {
    count: number
  },
  user: Object
};

type Props = {
  viewer?: ViewerPartial,
  relay: Object
};

type State = {
  isDropdownVisible: boolean,
  scheduledBuildsCount: number,
  runningBuildsCount: number
};

class MyBuilds extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    // When the MyBuilds starts, see if we've got either cached or
    // current build numbers so we can show something right away.
    const initialState = {
      isDropdownVisible: false,
      scheduledBuildsCount: (
        (this.props.viewer && this.props.viewer.scheduledBuilds)
          ? this.props.viewer.scheduledBuilds.count
          : 0
      ),
      runningBuildsCount: (
        (this.props.viewer && this.props.viewer.runningBuilds)
          ? this.props.viewer.runningBuilds.count
          : 0
      )
    };

    const cachedState = this.getCachedState();

    if (!this.props.viewer || !this.props.viewer.scheduledBuilds) {
      initialState.scheduledBuildsCount = cachedState.scheduledBuildsCount || 0;
    }

    if (!this.props.viewer || !this.props.viewer.runningBuilds) {
      initialState.runningBuildsCount = cachedState.runningBuildsCount || 0;
    }

    this.state = initialState;
  }

  // NOTE: the localStorage key is 'CachedState:MyBuilds:' for backwards
  // compatibility with data stored by the CachedStateWrapper this used to use.
  getCachedState() {
    const { state, expiresAt } = JSON.parse(localStorage['CachedState:MyBuilds:'] || '{}');

    if (!state || (expiresAt && expiresAt < Date.now())) {
      return {};
    }

    return state;
  }

  setCachedState(state = {}) {
    this.setState(state, () => {
      localStorage['CachedState:MyBuilds:'] = JSON.stringify({
        state,
        expiresAt: Date.now() + hour.bind(1)
      });
    });
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
    setTimeout(this.handlePusherConnected, seconds.bind(3));
  }

  componentWillUnmount() {
    PusherStore.off("user_stats:change", this.handlePusherWebsocketEvent);
    PusherStore.off("connected", this.handlePusherConnected);
  }

  // As we get new values for scheduledBuildsCount and runningBuildsCount from
  // Relay + GraphQL, we'll be sure to update the cached state with the latest
  // values so when the page re-loads, we can show the latest numbers.
  componentDidUpdate(prevProps: { viewer?: ViewerPartial }) {
    const { viewer } = this.props;
    const { viewer: prevViewer } = prevProps;

    // If we don't have a current Viewer object, we know we don't have fresh data
    if (!viewer) {
      return;
    }

    // If we have a previous viewer object with build data, let's
    // check if any of the counts have changed, and abort if not
    if (prevViewer && prevViewer.scheduledBuilds && prevViewer.runningBuilds) {
      if (
        viewer.scheduledBuilds.count === prevViewer.scheduledBuilds.count &&
        viewer.runningBuilds.count === prevViewer.runningBuilds.count
      ) {
        return;
      }
    }

    // Finally, update the state
    this.setCachedState({
      scheduledBuildsCount: viewer.scheduledBuilds.count,
      runningBuildsCount: viewer.runningBuilds.count
    });
  }

  render() {
    return (
      <Dropdown width={320} className="flex ml-auto" onToggle={this.handleDropdownToggle}>
        <DropdownButton className={classNames("flex-none py0", { "lime": this.state.isDropdownVisible })} onMouseEnter={this.handleButtonMouseEnter}>
          {'My Builds '}
          <div className="xs-hide">
            <CSSTransition
              in={this.getBuildsCount() > 0}
              classNames="transition-appear-pop"
              timeout={{
                enter: 200,
                exit: 200
              }}
            >
              {this.renderBadge()}
            </CSSTransition>
          </div>
          <Icon
            icon="down-triangle"
            className="flex-none"
            style={{
              width: 7,
              height: 7,
              marginLeft: '.5em'
            }}
          />
        </DropdownButton>

        {this.renderDropdown()}
      </Dropdown>
    );
  }

  getBuildsCount() {
    return this.state.runningBuildsCount + this.state.scheduledBuildsCount;
  }

  renderBadge() {
    const buildsCount = this.getBuildsCount();

    // Render nothing (an empty span) if we've not got a number to show
    if (!buildsCount) {
      return <span />;
    }

    return (
      <Badge className={classNames("hover-lime-child", { "bg-lime": this.state.isDropdownVisible })}>
        {buildsCount}
      </Badge>
    );
  }

  renderDropdown() {
    // If `builds` here is null, that means that Relay hasn't fetched the data
    // for it yet. It will become an Array once it's loaded.
    if (!this.props.viewer || !this.props.viewer.user.builds) {
      return this.renderSpinner();
    }

    // Once we've got an array of builds, we either show what we have, or the
    // setup instructions.
    if (this.props.viewer.user.builds.edges.length > 0) {
      return this.renderBuilds();
    }

    return this.renderSetupInstructions();
  }

  renderBuilds() {
    if (!this.props.viewer) {
      return;
    }

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

export default Relay.createContainer(MyBuilds, {
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
