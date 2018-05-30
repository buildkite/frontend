import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Link from './link';
import Icon from '../../shared/Icon';

class Footer extends React.PureComponent {
  static propTypes = {
    viewer: PropTypes.shape({
      unreadChangelogs: PropTypes.shape({
        count: PropTypes.number
      })
    }),
    relay: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    let changelogBadge;
    // Viewer is not supplied when rendered for an anonymous user
    if (this.props.viewer && this.props.viewer.unreadChangelogs && this.props.viewer.unreadChangelogs.count > 0) {
      changelogBadge = (
        <span className={`inline-block bg-dark-gray hover-lime-child white rounded ml1 small p1 line-height-1`}>{this.props.viewer.unreadChangelogs.count}</span>
      );
    }

    return (
      <footer className="center border-top border-gray dark-gray" style={{ marginTop: 40, paddingTop: 30 }}>
        <div className="mt4 mb4 small">
          <Link href="/home">Home</Link>
          <Link href="/changelog">
            <span>Changelog</span>{changelogBadge}
          </Link>
          <Link href="/blog">Blog</Link>
          <Link href="/docs">Docs</Link>
          <Link href="https://github.com/buildkite/feedback/issues">Feedback</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms-of-service">Terms</Link>
          <Link href="mailto:support@buildkite.com">Support</Link>
          <Link href="https://buildkitestatus.com/">System Status</Link>
        </div>
        <div className="mt4 mb4">
          <a href="http://twitter.com/buildkite" className={`btn hover-lime px1`}><Icon icon="twitter" /></a>
          <a href="https://github.com/buildkite" className={`btn hover-lime px1`}><Icon icon="github" /></a>
        </div>
      </footer>
    );
  }
}

export default Relay.createContainer(Footer, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    viewer: () => Relay.QL`
      fragment on Viewer {
        unreadChangelogs: changelogs(read: false) @include(if: $isMounted) {
          count
        }
      }
    `
  }
});
