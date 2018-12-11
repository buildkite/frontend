import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shallowCompare from 'react-addons-shallow-compare';

import Badge from 'app/components/shared/Badge';
import BaseButton from 'app/components/shared/Button';
import Icon from 'app/components/shared/Icon';

class Button extends React.Component {
  static displayName = "Menu.Button";

  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    count: PropTypes.number,
    badge: PropTypes.string,
    href: PropTypes.string,
    forceActive: PropTypes.bool,
    link: PropTypes.string
  };

  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    lastPathname: null
  };

  UNSAFE_componentWillMount() {
    this.setState({
      lastPathname: window.location.pathname
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    // This is a weird little perf hack;
    //
    // If we're in a router context, we allow window path
    // changes to trigger a re-render and a state change &
    // re-render, as this allows us to react to state changes
    // correctly, while still remaining optimised the rest
    // of the time.
    if (this.context.router && nextState.lastPathname !== window.location.pathname) {
      this.setState({
        lastPathname: window.location.pathname
      });

      return true;
    }

    // Otherwise, we defer to shallowCompare rules!
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <BaseButton
        className={classNames(
          'flex items-center hover-lime focus-lime border-none',
          { lime: this._isActive() }
        )}
        style={{ minHeight: '3.1em' }}
        theme={false}
        href={this.props.href}
        link={this.props.link}
      >
        <div className="flex-auto flex items-center">
          {this._renderIcon()}
          <div className="flex-auto truncate">{this.props.label}{this._renderBadge()}</div>
          {this._renderCountBadge()}
        </div>
      </BaseButton>
    );
  }

  _getLink({ link, href }) {
    return link || href;
  }

  _isActive() {
    if (this.props.forceActive !== undefined) {
      return this.props.forceActive;
    }

    const href = this._getLink(this.props);

    // If we're in a router context, defer to the router
    if (this.context.router) {
      return this.context.router.isActive(href);
    }

    // Otherwise, use a super simple way of figuring out if the current href is active
    return this.state.lastPathname.indexOf(href) === 0;
  }

  _renderIcon() {
    if (this.props.icon) {
      return (
        <Icon className="flex-none icon-mr" icon={this.props.icon} />
      );
    }
  }

  _renderBadge() {
    if (this.props.badge) {
      return (
        <Badge outline={true}>
          {this.props.badge}
        </Badge>
      );
    }
  }

  _renderCountBadge() {
    if (this.props.count) {
      return (
        <Badge
          className={classNames(
            'flex-none hover-lime-child',
            { 'bg-lime': this._isActive() }
          )}
        >
          {this.props.count}
        </Badge>
      );
    }
  }
}

export default Button;

