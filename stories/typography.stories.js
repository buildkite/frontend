/* global module */

import React from 'react';
import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';

const Example = function(props) {
  return <div className={`my3 border-left border-${props.border || "gray"} pl4 py2`}>{props.children}</div>;
};
Example.propTypes = { children: PropTypes.node, border: PropTypes.string };

const Section = function(props) {
  return (
    <div className="max-width-2">
      {props.children}
    </div>
  );
};
Section.propTypes = { children: PropTypes.node };

const combinations = () => (
  <Section>
    <Example>
      <p className="h1 m0" data-sketch-symbol="Text/h1" data-sketch-text="Heading - h1">Pipeline Settings — h1</p>
      <p className="h3 m0" data-sketch-symbol="Text/h3" data-sketch-text="Heading - h3">Manage your how your pipeline works — h3</p>
    </Example>

    <Example>
      <p className="h2 m0" data-sketch-symbol="Text/h2" data-sketch-text="Heading - h2">Pipeline Settings — h2</p>
      <p className="h4 m0" data-sketch-symbol="Text/h4" data-sketch-text="Text - h4">Manage your how your pipeline works — h4</p>
    </Example>

    <Example>
      <p className="h3 m0" data-sketch-symbol="Text/h3" data-sketch-text="Text - h4">Pipeline Settings — h3</p>
      <p className="h5 m0" data-sketch-symbol="Text/h5" data-sketch-text="Text - h5">Manage your how your pipeline works — h5</p>
    </Example>

    <Example>
      <p className="h4 m0" data-sketch-symbol="Text/h4" data-sketch-text="Text - h4">Pipeline Settings — h4</p>
      <p className="h5 m0 dark-gray" data-sketch-symbol="Text/h5 (Subdued)" data-sketch-text="Text - h5 Subdued">Manage your how your pipeline works — h5</p>
    </Example>

    <Example>
      <p className="h5 m0" data-sketch-symbol="Text/h5" data-sketch-text="Text - h4">Pipeline Settings — h5</p>
      <p className="h6 m0 dark-gray" data-sketch-symbol="Text/h6 (Subdued)" data-sketch-text="Text - h6 Subdued">Manage your how your pipeline works — h6</p>
    </Example>
  </Section>
);

storiesOf('Typography', module)
  .add('Combinations', combinations);

storiesOf('Typography', module)
  .add('Choosing Sizes', () => (
    <Section>
      <p className="my3">You want enough contrast between type so that the hierarchy is clear. With our type scale, a good rule of thumb is to ensure text is at least two sizes different.</p>

      <p className="mt4 mb3">For example, the following lacks typographic contrast:</p>
      <Example border="red">
        <p className="h1 m0" title="h1">Pipeline Settings — h1</p>
        <p className="h2 m0" title="h2">Manage your how your pipeline works — h2</p>
      </Example>

      <p className="mt4 mb3">The ideal solution is to make sure there’s two sizes between them, i.e. switch the second paragraph to a .h3:</p>
      <Example border="green">
        <p className="h1 m0" title="h1">Pipeline Settings — h1</p>
        <p className="h3 m0" title="h2">Manage your how your pipeline works — h3</p>
      </Example>

      <p className="mt4 mb3">If you can’t adjust the size to have enough contrast, you can introduce colour to achieve some contrast:</p>
      <Example border="green">
        <p className="h1 m0">Pipeline Settings — h1</p>
        <p className="h2 m0 dark-gray">Manage your how your pipeline works — h2</p>
      </Example>

      <p className="mt4 mb3">And finally, if size and colour can’t be adjusted, you can use weight:</p>
      <Example border="green">
        <p className="h1 m0 bold">Pipeline Settings — h1</p>
        <p className="h2 m0">Manage your how your pipeline works — h2</p>
      </Example>

      <p className="my4">The general rule is to try to adjust font-size first, and then colour, and then weight.</p>
    </Section>
  ));

export const Sketch = combinations;