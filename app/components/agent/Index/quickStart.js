import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Emojify from '../../shared/Emojify';
import Panel from '../../shared/Panel';

import 'highlight.js/styles/github.css';

// Grab all the guide documents (*.mdx) from the file system (at ../../docs)
const GUIDES = ((guideRequire) =>
  guideRequire.keys().map((guidePath) =>
    guideRequire(guidePath).default
  )
)(require.context('../../docs', true, /\.mdx$/));

class QuickStart extends React.Component {
  static propTypes = {
    organization: React.PropTypes.shape({
      agentTokens: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired
  };

  state = {
    selectedGuide: null
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  handleSelectedGuideChange(selectedGuide, evt) {
    evt.preventDefault();
    const newState = { selectedGuide: null };

    if (selectedGuide !== this.state.selectedGuide) {
      newState.selectedGuide = selectedGuide;
    }

    this.setState(newState);
  }

  renderGuideButtons() {
    return (
      <div className="center" style={{ margin: -5 }}>
        {
          GUIDES.map((Guide, index) => (
            <a
              key={index}
              href="#"
              className={classNames(
                'inline-block blue hover-navy text-decoration-none border rounded m1 p1',
                {
                  'border-white': index !== this.state.selectedGuide,
                  'border-gray': index === this.state.selectedGuide
                }
              )}
              onClick={this.handleSelectedGuideChange.bind(this, index)} // eslint-disable-line react/jsx-no-bind
            >
              <Emojify
                className="block mt1"
                style={{ fontSize: '1.15em' }}
                text={Guide.emoji || `:${Guide.title.toLowerCase()}:`}
              />
              {Guide.title}
            </a>
          ))
        }
      </div>
    );
  }

  renderGuide() {
    const GuideToRender = GUIDES[this.state.selectedGuide];

    if (GuideToRender) {
      return (
        <GuideToRender
          className="border border-gray mt3"
          style={{
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none'
          }}
          elementProps={{
            'a': {
              className: 'blue hover-navy text-decoration-none hover-underline'
            },
            'pre': {
              className: 'border border-gray rounded bg-silver overflow-auto p2 monospace'
            }
          }}
          token={this.props.organization.agentTokens.edges[0].node.token}
        />
      );
    }
  }

  render() {
    return (
      <Panel className="mb3">
        <Panel.Header><center>Agent Quick Start Guides</center></Panel.Header>
        <Panel.Section>
          {this.renderGuideButtons()}
          {this.renderGuide()}
        </Panel.Section>
      </Panel>
    );
  }
}

export default Relay.createContainer(QuickStart, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        agentTokens(first: 1, revoked: false) @include(if: $isMounted) {
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
