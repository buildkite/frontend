import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Title from './title';
import Button from './button';
import Description from './description';
import Menu from './menu';
import Icon from './icon';

class PageHeader extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    followedByTabs: PropTypes.bool
  };

  renderAffix(affixContent) {
    if (!affixContent) {
      return;
    }

    return <div className="flex-none mb2">{affixContent}</div>;
  }

  render() {
    const children = React.Children.toArray(this.props.children);

    // Filter out the menu from the children
    const content = [];
    let pre;
    let post;
    children.forEach((child) => {
      if (child.type.displayName === "PageHeader.Icon") {
        pre = child;
      } else if (child.type.displayName === "PageHeader.Menu") {
        post = child;
      } else {
        content.push(child);
      }
    });

    return (
      <section
        className={classNames("flex flex-wrap items-top", {
          "mb2": !this.props.followedByTabs,
          "mb0": this.props.followedByTabs
        })}
      >
        {this.renderAffix(pre)}
        <div className="flex-auto mb2" style={{ flexBasis: 160 }}>{content}</div>
        {this.renderAffix(post)}
      </section>
    );
  }
}

PageHeader.Title = Title;
PageHeader.Button = Button;
PageHeader.Description = Description;
PageHeader.Menu = Menu;
PageHeader.Icon = Icon;

export default PageHeader;
