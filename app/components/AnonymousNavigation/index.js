// @flow

import * as React from 'react';

type Props = {};

export default class AnonymousNavigation extends React.PureComponent<Props> {
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
                <img style={{ marginBottom: -3 }} alt="Buildkite" className="xs-hide" src="/assets/logo-full-dark-backgrounds-43567d29c99445a96712f669628329768290f07755f1c5269d90171b2990e824.svg" width="102" height="19" />
                <img alt="Buildkite" className="sm-hide md-hide lg-hide" src="/assets/mark-bc1292d2385e00f9ec7032e7ffbc118c33dd4922c3338c99abf43ae1c2a3eee5.svg" width="40" height="40" />
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

type Anchorprops = {
  title: string,
  href: string,
  style?: {string: any}
};

function Anchor(props: Anchorprops) {
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
