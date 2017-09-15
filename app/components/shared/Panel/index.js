// @flow

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

type Props = {
  children: React$Node,
  className?: string
};

class Panel extends React.PureComponent<Props> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
  };

  static Header: Object = Header;
  static IntroWithButton: Object = IntroWithButton;
  static Row: Object = Row;
  static RowActions: Object = RowActions;
  static RowLink: Object = RowLink;
  static Footer: Object;
  static Section: Object;

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

  // NOTE: We have to cast Panel to Object so we can assign
  //       in this way. We should probably do this a better way.
  //       see <https://github.com/facebook/flow/issues/1323>
  (Panel: Object)[componentName] = Component;
});

export default Panel;
