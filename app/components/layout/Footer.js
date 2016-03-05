import React from 'react';

let COLOR = (Features.NewNav == undefined || Features.NewNav == true) ? "lime" : "blue";

const Link = (props) => {
  return (
    <a href={props.href} className={`btn bold hover-${COLOR} hover-faded`}>{props.children}</a>
  );
}

Link.propTypes = {
  href: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired
};

const Footer = (props) => {
  let changelogBadge;
  if(props.viewer && props.viewer.unreadChangelogs.count > 0) {
    changelogBadge = (
      <span className={`inline-block bg-black hover-${COLOR}-child white rounded ml1 small p1 line-height-1`}>{props.viewer.unreadChangelogs.count}</span>
    );
  }

  return (
    <footer className="center border-top border-gray" style={{marginTop: 40, paddingTop: 30}}>
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
      </div>
      <div className="mt4 mb4 h3">
        <a href="http://twitter.com/buildkite" className={`btn hover-${COLOR} px1 hover-faded`}><i className="fa fa-twitter fa-text-color"></i></a>
        <a href="https://github.com/buildkite" className={`btn hover-${COLOR} px1 hover-faded`}><i className="fa fa-github fa-text-color"></i></a>
      </div>
    </footer>
  )
}

Footer.propTypes = {
  viewer: React.PropTypes.shape({
    unreadChangelogs: React.PropTypes.shape({
      count: React.PropTypes.integer
    })
  })
};

export default Footer;
