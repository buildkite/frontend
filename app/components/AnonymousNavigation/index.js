// @flow

import * as React from 'react';
import logoSrc from 'app/images/logo-full-dark-backgrounds.svg';
import markSrc from 'app/images/mark.svg';

export default class AnonymousNavigation extends React.PureComponent<{}> {
  render() {
    return (
      <div
        className="border-bottom border-gray bg-silver"
        style={{ marginBottom: 25 }}
        data-tag={true}
      >
        <div className={`container ${window.Features.Widescreen ? "container-widescreen" : ""}`}>
          <div className="flex flex-stretch" style={{ height: 45 }}>
            <div className="flex flex-auto">
              <a href="/" className="btn black hover-lime focus-lime flex items-center flex-none px3 hover-faded-children" style={{ paddingLeft: 0 }}>
                <img
                  style={{ marginBottom: -3 }}
                  alt="Buildkite"
                  className="xs-hide"
                  src={logoSrc}
                  width="102"
                  height="19"
                />
                <img
                  alt="Buildkite"
                  className="sm-hide md-hide lg-hide"
                  src={markSrc}
                  width="40"
                  height="40"
                />
              </a>
            </div>
            <div className="flex">
              <Anchor href="/login" title="Log In" />
              <Anchor href="/signup" title="Sign Up" />
              <Anchor href="/" title="Learn More…" style={{ paddingRight: 0 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type AnchorProps = {
  title: string,
  href: string,
  style?: Object
};

function Anchor(props: AnchorProps) {
  return (
    <a
      className="btn black hover-lime focus-lime flex items-center flex-none"
      title={props.title}
      href={props.href}
      style={props.style}
    >
      {props.title}
    </a>
  );
}
