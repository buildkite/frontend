import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';
import RevealButton from '../../shared/RevealButton';

class AgentTokens extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      agentTokens: PropTypes.shape({
        edges: PropTypes.array.isRequired
      }),
      permissions: PropTypes.shape({
        agentTokenView: PropTypes.shape({
          allowed: PropTypes.bool.isRequired
        }).isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    setupMode: PropTypes.bool
  };

  static defaultProps = {
    title: 'Agent Token',
    setupMode: false
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    return (
      <Panel className="mb3">
        <Panel.Header>
          {this.props.title}
        </Panel.Header>
        <Panel.Section>
          <span>Your Buildkite agent token is used to configure and start new Buildkite agents. </span>
          {!this.props.setupMode && <span>See the <a className="blue hover-navy text-decoration-none hover-underline" href="/docs/agent">agent documentation</a> to learn more.</span>}
        </Panel.Section>
        {this.renderBody()}
      </Panel>
    );
  }

  renderBody() {
    if (this.props.organization.agentTokens) {
      if (this.props.organization.permissions.agentTokenView.allowed) {
        return this.props.organization.agentTokens.edges.map((edge) => this.renderRow(edge.node));
      } else {
        return (
          <Panel.Section>
            <p className="dark-gray">You don’t have permission to see your organization’s Agent tokens.</p>
          </Panel.Section>
        );
      }
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
        {this.renderDescription(token)}
        <RevealButton caption="Reveal Agent Token">
          <code className="red monospace" style={{ wordWrap: "break-word" }}>
            {token.token}
          </code>
        </RevealButton>
      </Panel.Row>
    );
  }

  renderDescription(token) {
    if (this.props.organization.agentTokens.edges.length > 1) {
      return (
        <small className="dark-gray mb1 block">
          {token.description}
        </small>
      );
    }
  }
}

export default Relay.createContainer(AgentTokens, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        permissions @include(if: $isMounted) {
          agentTokenView {
            allowed
          }
        }
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
