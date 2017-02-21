import React from 'react';
import Relay from 'react-relay';
import { seconds } from 'metrick/duration';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import Emojify from '../../shared/Emojify';
import Panel from '../../shared/Panel';

class AgentInstallation extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      agents: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        edges: React.PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    isDialogOpen: false
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
    this._agentRefreshInterval = setInterval(this.fetchUpdatedData, 5::seconds);
  }

  componentWillUnmount() {
    clearInterval(this._agentRefreshInterval);
  }

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(true);
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.organization.agents && this.props.organization.agents && nextProps.organization.agents.count > this.props.organization.agents.count) {
      this.setState({ isDialogOpen: true });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    const { organization } = this.props;

    let agentName = 'an agent';

    if (organization.agents && organization.agents.edges.length) {
      const newestAgent = organization.agents.edges.pop().node;
      agentName = (
        <strong>
          <Emojify text={newestAgent.name} />
        </strong>
      );
    }

    return (
      <Panel className="mb3">
        <Panel.Header>
          Installation documentation
        </Panel.Header>
        <Panel.Section>
          See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/installation">agent installation documentation</a> for the full details of installing and configuring your Buildkite agents for any machine or architecture.
          <Dialog closeable={false} isOpen={true}>
            <div className="center" style={{padding: "50px 10px"}}>
              <p className="mt0 h2">
                <Emojify text=":tada:" /> You’ve successfully connected {agentName}!<br/>
                You’re all ready to run builds!
              </p>
              <Button link={`/${organization.slug}`}>Take me to the dashboard</Button>
            </div>
          </Dialog>
        </Panel.Section>
      </Panel>
    );
  }
}

export default Relay.createContainer(AgentInstallation, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        slug
        agents(last: 1) @include(if: $isMounted) {
          count
          edges {
            node {
              name
            }
          }
        }
      }
    `
  }
});

