import React from 'react';
import classNames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class NewChangelogsBadge extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="transition-changelog-appear" transitionAppear={true} transitionAppearTimeout={3000} transitionEnterTimeout={5000} transitionLeaveTimeout={5000}>
        <span key="badge" className={classNames(this.props.className, "inline-block hover-faded")} style={this.props.style}>
          <a href="/changelog" className="btn bg-lime white hover-white focus-white line-height-1" style={{ padding: '3px 4px', fontSize: '9px', borderRadius: 5 }}>NEW</a>
          <img className="pointer-events-none" src={require('../../images/new-changelog-badge-bottom-corner.svg')} style={{width: 12, height: 12, position: 'absolute', left: -3, bottom: -2}} />
        </span>
      </ReactCSSTransitionGroup>
    );
  }
}

export default NewChangelogsBadge;
