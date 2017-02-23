import React from 'react';
import Relay from 'react-relay';
import { seconds } from 'metrick/duration';
import shallowCompare from 'react-addons-shallow-compare';
import Confetti from 'react-confetti';

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

    // This page doesn't have a list of agents, so if they haven ANY agents
    // connected then they shouldn't be looking here, with the exception of if
    // it's the first time connected agent with the nice dialog
    if (!this.state.isDialogOpen && organization.agents && organization.agents && organization.agents.count) {
      window.location = window.location.toString().replace('?setup=true', '');
    }

    return (
      <Panel className="mb3">
        <Panel.Header>
          Installation documentation
        </Panel.Header>
        <Panel.Section>
          See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent/installation">agent installation documentation</a> for the full details of installing and configuring your Buildkite agents for any machine or architecture.
          <Dialog isOpen={this.state.isDialogOpen} onRequestClose={this.handleFirstAgentDialogClose} width={350}>
            <div className="center p4" style={{ paddingTop: 45, paddingBottom: 50 }}>
              <p className="m0 mb2">
                <Emojify text=":raised_hands:" style={{ fontSize: 32 }} />
              </p>
              <p className="m0 h4 bold mb2" style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }}>
                You’ve connected your first Buildkite Agent!
              </p>
              <Button outline={true} theme="default" link={`/${organization.slug}`} className="mt2">Manage Your Pipelines</Button>
            </div>
          </Dialog>
        </Panel.Section>
        {this.renderConfetti()}
      </Panel>
    );
  }

  renderConfetti() {
    if (this.state.isDialogOpen) {
      return (
        <Confetti />
      );
    }
  }

  handleFirstAgentDialogClose = () => {
    this.setState({ isDialogOpen: false });
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

