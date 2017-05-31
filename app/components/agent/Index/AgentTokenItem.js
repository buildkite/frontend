import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from '../../shared/Panel';
import RevealButton from '../../shared/RevealButton';

class AgentTokenItem extends React.Component {
  static propTypes = {
    agentToken: PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
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
        </small>
      );
    }
  }
}

export default Relay.createContainer(AgentTokenItem, {
  fragments: {
    agentToken: () => Relay.QL`
      fragment on AgentToken {
        id
        description
        token
      }
    `
  }
});
