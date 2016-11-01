import React from 'react';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';
import RevealButton from '../../shared/RevealButton';

class AgentTokens extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      agentTokens: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    return (
      <Panel>
        <Panel.Header>Agent Token</Panel.Header>
        <Panel.Section>
          <span>Your Buildkite agent token is used to configure and start new Buildkite agents.</span>
        </Panel.Section>
        {this.renderBody()}
      </Panel>
    );
  }

  renderBody() {
    if (this.props.organization.agentTokens) {
      return this.props.organization.agentTokens.edges.map((edge) => this.renderRow(edge.node));
    } else {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }
  }

  renderRow(token) {
    return (
      <Panel.Row key={token.id}>
        <small className="dark-gray mb1 block">{token.description}</small>
        <RevealButton caption="Reveal Agent Token">
          <code className="red monospace" style={{ wordWrap: "break-word" }}>{token.token}</code>
        </RevealButton>
      </Panel.Row>
    );
  }
}

export default Relay.createContainer(AgentTokens, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        agentTokens(first: 50, revoked: false) @include(if: $isMounted) {
          edges {
            node {
              id
              description
              token
            }
          }
        }
      }
    `
  }
});
