import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import { seconds } from 'metrick/duration';
import Confetti from 'react-confetti';

import Button from 'app/components/shared/Button';
import Dialog from 'app/components/shared/Dialog';
import Emojify from 'app/components/shared/Emojify';
import Panel from 'app/components/shared/Panel';

class AgentInstallation extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      agents: PropTypes.shape({
        count: PropTypes.number.isRequired,
        edges: PropTypes.array.isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isDialogOpen: false
  };

  componentDidMount() {
    this.props.relay.setVariables(
      { isMounted: true },
      (readyState) => {
        if (readyState.done) {
          this.startTimeout();
        }
      }
    );
  }

  componentWillUnmount() {
    clearTimeout(this._agentRefreshTimeout);
  }

  startTimeout = () => {
    this._agentRefreshTimeout = setTimeout(
      this.fetchUpdatedData,
      5::seconds
    );
  };

  fetchUpdatedData = () => {
    this.props.relay.forceFetch(
      true,
      (readyState) => {
        if (readyState.done) {
          this.startTimeout();
        }
      }
    );
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.organization.agents && this.props.organization.agents && nextProps.organization.agents.count > this.props.organization.agents.count) {
      this.setState({ isDialogOpen: true });
    }
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
              <p className="m0 h3 bold mb2" style={{ paddingLeft: '1.5em', paddingRight: '1.5em' }}>
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

