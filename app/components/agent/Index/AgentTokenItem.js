import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay/compat';

import Badge from 'app/components/shared/Badge';
import Panel from 'app/components/shared/Panel';
import RevealButton from 'app/components/shared/RevealButton';

class AgentTokenItem extends React.PureComponent {
  static propTypes = {
    agentToken: PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      public: PropTypes.bool.isRequired,
      token: PropTypes.string.isRequired
    }).isRequired,
    showDescription: PropTypes.bool
  };

  render() {
    return (
      <Panel.Row key={this.props.agentToken.id}>
        {this.renderDescription()}
        <RevealButton caption="Reveal Agent Token">
          <code className="red monospace" style={{ wordWrap: "break-word" }}>
            {this.props.agentToken.token}
          </code>
        </RevealButton>
      </Panel.Row>
    );
  }

  renderDescription() {
    if (this.props.showDescription) {
      return (
        <small className="dark-gray mb1 block">
          {this.props.agentToken.description}
          {this.renderPublicBadge()}
        </small>
      );
    }
  }

  renderPublicBadge() {
    if (this.props.agentToken.public) {
      return (
        <Badge outline={true} className="regular very-dark-gray" title="Agents registered with this token will be visible to everyone, including people outside this organization">Public</Badge>
      );
    }
  }
}

export default createFragmentContainer(AgentTokenItem, {
  agentToken: graphql`
    fragment AgentTokenItem_agentToken on AgentToken {
      id
      description
      public
      token
    }
  `
});
