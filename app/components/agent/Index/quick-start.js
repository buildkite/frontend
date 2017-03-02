import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import shallowCompare from 'react-addons-shallow-compare';
import classNames from 'classnames';

import Emojify from '../../shared/Emojify';
import Panel from '../../shared/Panel';

import 'highlight.js/styles/atom-one-light.css';

// Grab guides from the file system (at ../../docs)
const GUIDES = ((guideRequire) =>
  guideRequire.keys().map((guidePath) =>
    guideRequire(guidePath).default
  )
)(require.context(
  '../../docs',
  true,
  /^\.\/[^\/]+(?:\/index)?\.[^\/]*$/ // matches any file in ../../docs, or any index file in a subdirectory of ../../docs
));

const getEmojiForGuide = ({ emoji, title }) => emoji || `:${title.toLowerCase()}:`;
const getSlugForGuide = ({ slug, title }) => slug || encodeURIComponent(title.toLowerCase());

class QuickStart extends React.Component {
  static propTypes = {
    center: React.PropTypes.bool.isRequired,
    location: React.PropTypes.shape({
      hash: React.PropTypes.string.isRequired,
      pathname: React.PropTypes.string.isRequired,
      search: React.PropTypes.string.isRequired
    }).isRequired,
    organization: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      uuid: React.PropTypes.string,
      agentTokens: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      })
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    title: React.PropTypes.string.isRequired,
    viewer: React.PropTypes.shape({
      apiAccessTokens: React.PropTypes.shape({
        edges: React.PropTypes.array.isRequired
      })
    })
  };

  static defaultProps = {
    center: true,
    title: 'Agent Quick Start Guides'
  }

  componentDidMount() {
    this.props.relay.setVariables({
      isMounted: true,
      organizationSlug: this.props.organization.slug
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  getSlugFromHash() {
    const { location: { hash } } = this.props;

    if (hash.length < 2) {
      return null;
    }

    return hash.split('#setup-').pop() || null;
  }

  getIndexOfGuide() {
    const slugToFind = this.getSlugFromHash();

    if (!slugToFind) {
      return null;
    }

    const index = GUIDES.findIndex(
      (Guide) => getSlugForGuide(Guide) === slugToFind
    );

    if (index === -1) {
      return null;
    }

    return index;
  }

  renderGuideButtons(selectedGuideIndex) {
    const baseUri = `${this.props.location.pathname}${this.props.location.search}`;

    return (
      <div className="center" style={{ margin: -5 }}>
        {
          GUIDES.map((Guide, index) => (
            <Link
              key={index}
              to={
                index === selectedGuideIndex
                  ? baseUri // use base route URI for selected guide so we can close it
                  : `${baseUri}#setup-${getSlugForGuide(Guide)}`
              }
              className={classNames(
                'inline-block blue hover-navy text-decoration-none border rounded m1 p1',
                {
                  'border-white': index !== selectedGuideIndex,
                  'border-gray': index === selectedGuideIndex
                }
              )}
            >
              <Emojify
                className="block mt1"
                style={{ fontSize: '1.15em' }}
                text={getEmojiForGuide(Guide)}
              />
              {Guide.title}
            </Link>
          ))
        }
      </div>
    );
  }

  renderGuide(selectedGuideIndex) {
    const GuideToRender = GUIDES[selectedGuideIndex];
    const { name, slug, uuid, agentTokens: { edges: agentTokens } = {} } = this.props.organization;
    const { apiAccessTokens: { edges: apiAccessTokens } = {} } = this.props.viewer;

    // Only show the token in the parameter table if we've got access to one
    let token;
    if (agentTokens && agentTokens.length && agentTokens[0].node.token) {
      token = agentTokens[0].node.token;
    }

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
            'code': {
              style: { fontFamily: 'Monaco, Consolas, monospace', fontSize: '.9em' }
            },
            'a': {
              className: 'blue hover-navy text-decoration-none hover-underline'
            },
            'pre': {
              className: 'border border-gray rounded bg-silver overflow-auto p2 monospace'
            },
            'h2': {
              className: 'h5 semi-bold'
            }
          }}
          token={token}
          apiAccessTokens={apiAccessTokens ? apiAccessTokens.map((edge) => edge.node) : []}
          organization={{ name, slug, uuid }}
        />
      );
    }
  }

  render() {
    const selectedGuideIndex = this.getIndexOfGuide();
    const headerClassName = classNames({ center: this.props.center });

    return (
      <Panel className="mb3">
        <Panel.Header className={headerClassName}>
          {this.props.title}
        </Panel.Header>
        <Panel.Section>
          {this.renderGuideButtons(selectedGuideIndex)}
          {this.renderGuide(selectedGuideIndex)}
        </Panel.Section>
      </Panel>
    );
  }
}

export default Relay.createContainer(QuickStart, {
  initialVariables: {
    isMounted: false,
    organizationSlug: null
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        apiAccessTokens(
          first: 10,
          template: [ ELASTIC_CI_AWS ],
          organizations: [ $organizationSlug ]
        ) @include(if: $isMounted) {
          edges {
            node {
              description
              uuid
              token
            }
          }
        }
      }
    `,
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        uuid @include(if: $isMounted)
        agentTokens(first: 1, revoked: false) @include(if: $isMounted) {
          edges {
            node {
              token
            }
          }
        }
      }
    `
  }
});
