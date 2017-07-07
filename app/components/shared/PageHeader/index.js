import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Title from './title';
import Button from './button';

class PageHeader extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
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
      <section className="flex flex-wrap items-top mb2">
        {this.renderAffix(pre)}
        <div className="flex-auto mb2" style={{ flexBasis: 160 }}>{content}</div>
        {this.renderAffix(post)}
      </section>
    );
  }
}

PageHeader.Title = Title;
PageHeader.Button = Button;

const SIMPLE_COMPONENTS = {
  Description: 'dark-gray mt1 max-width-2',
  Icon: 'flex items-center',
  Menu: 'flex items-center'
};

Object.keys(SIMPLE_COMPONENTS).forEach((componentName) => {
  const defaultStyle = SIMPLE_COMPONENTS[componentName];

  const Component = (props) => (
    <div className={classNames(defaultStyle, props.className)}>
      {props.children}
    </div>
  );

  Component.displayName = `PageHeader.${componentName}`;
  Component.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  PageHeader[componentName] = Component;
});

export default PageHeader;
