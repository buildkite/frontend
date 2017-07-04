import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styled from 'styled-components';

import IntroWithButton from './intro-with-button';
import Row from './row';
import RowActions from './row-actions';
import RowLink from './row-link';
import Header from './header';

const Separator = styled.hr.attrs({
  className: 'p0 m0 bg-gray'
})`
  border: none;
  height: 1px;

  &:last-child {
    display: none;
  }
`;

class Panel extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  render() {
    const children = React.Children.toArray(this.props.children);

    // Insert a seperator between each section
    const nodes = [];
    let key = 0;
    for (let index = 0, length = children.length; index < length; index++) {
      if (index > 0) {
        nodes.push(<Separator key={key += 1} />);
      }

      nodes.push(children[index]);
    }

    return (
      <section className={classNames("border border-gray rounded", this.props.className)}>
        {nodes}
      </section>
    );
  }
}

Panel.IntroWithButton = IntroWithButton;
Panel.Row = Row;
Panel.RowActions = RowActions;
Panel.RowLink = RowLink;
Panel.Header = Header;

const SIMPLE_COMPONENTS = {
  Footer: 'py2 px3',
  Section: 'm3'
};

Object.keys(SIMPLE_COMPONENTS).forEach((componentName) => {
  const defaultStyle = SIMPLE_COMPONENTS[componentName];

  const Component = (props) => (
    <div className={classNames(defaultStyle, props.className)}>
      {props.children}
    </div>
  );

  Component.displayName = `Panel.${componentName}`;
  Component.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  Panel[componentName] = Component;
});

export default Panel;
