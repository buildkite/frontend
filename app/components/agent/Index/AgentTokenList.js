import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from 'app/components/shared/Panel';
import Spinner from 'app/components/shared/Spinner';

import AgentTokenItem from './AgentTokenItem';

class AgentTokenList extends React.Component {
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
          {!this.props.setupMode && <span>See the <a className="lime hover-lime text-decoration-none hover-underline" href="/docs/agent">agent documentation</a> to learn more.</span>}
        </Panel.Section>
        {this.renderBody()}
      </Panel>
    );
  }

  renderBody() {
    if (this.props.organization.agentTokens) {
      if (this.props.organization.permissions.agentTokenView.allowed) {
        return this.props.organization.agentTokens.edges.map((edge) => {
          return (
            <AgentTokenItem key={edge.node.id} agentToken={edge.node} showDescription={this.props.organization.agentTokens.edges.length > 1} />
          );
        });
      }

      return (
        <Panel.Section>
          <p className="dark-gray">You don’t have permission to see your organization’s Agent tokens.</p>
        </Panel.Section>
      );
    }

    return (
      <Panel.Section className="center">
        <Spinner />
      </Panel.Section>
    );
  }
}

export default Relay.createContainer(AgentTokenList, {
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
              ${AgentTokenItem.getFragment("agentToken")}
            }
          }
        }
      }
    `
  }
});
