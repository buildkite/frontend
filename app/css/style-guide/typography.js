import React from 'react';
import PropTypes from 'prop-types';

const Example = function(props) {
  return <div className="my3 border-left border-gray pl4 py2">{props.children}</div>;
};
Example.propTypes = { children: PropTypes.node };

const Section = function(props) {
  return (
    <div className="max-width-2 my4 pt1">
      <hr className="col-1 ml0 mt2 border border-lime" />
      <h2 className="h2 bold mt4 line-height-1">{props.title}</h2>
      {props.children}
    </div>
  );
};
Section.propTypes = { title: PropTypes.string, children: PropTypes.node };

export default class Typography extends React.PureComponent {
  render() {
    return (
      <div>
        <h1 className="h1 bold">Typography</h1>

        <Section title="Size Classes">
          <p className="h1 my2">.h1 — Lorem ipsum dolor sit amet</p>
          <p className="h2 my2">.h2 — Lorem ipsum dolor sit amet</p>
          <p className="h3 my2">.h3 — Lorem ipsum dolor sit amet</p>
          <p className="h4 my2">.h4 — Lorem ipsum dolor sit amet — Regular text</p>
          <p className="h5 my2">.h5 — Lorem ipsum dolor sit amet</p>
          <p className="h6 my2">.h6 — Lorem ipsum dolor sit amet</p>
        </Section>

        <Section title="Weight Classes">
          <p className="regular my2">.regular — Lorem ipsum dolor sit amet</p>
          <p className="semi-bold my2">.semi-bold — Lorem ipsum dolor sit amet</p>
          <p className="bold my2">.bold — Lorem ipsum dolor sit amet</p>
        </Section>

        <Section title="How to choose between sizes">
          <p className="my3">You want enough contrast between type so that the hierarchy is clear. With our type scale, a good rule of thumb is to ensure text is at least two sizes different.</p>

          <p className="mt4 mb3">For example, the following lacks typographic contrast:</p>
          <Example>
            <p className="h1 m0" title="h1">Pipeline Settings — h1</p>
            <p className="h2 m0" title="h2">Manage your how your pipeline works — h2</p>
          </Example>

          <p className="mt4 mb3">You could increase the contrast by using weight:</p>
          <Example>
            <p className="h1 m0 bold">Pipeline Settings — h1</p>
            <p className="h2 m0">Manage your how your pipeline works — h2</p>
          </Example>

          <p className="mt4 mb3">Colour:</p>
          <Example>
            <p className="h1 m0">Pipeline Settings — h1</p>
            <p className="h2 m0 dark-gray">Manage your how your pipeline works — h2</p>
          </Example>

          <p className="mt4 mb3">Size:</p>
          <Example>
            <p className="h1 m0">Pipeline Settings — h1</p>
            <p className="h3 m0">Manage your how your pipeline works — h3</p>
          </Example>

          <p className="mt4 mb3">Both colour and size:</p>
          <Example>
            <p className="h1 m0">Pipeline Settings — h1</p>
            <p className="h3 m0 dark-gray">Manage your how your pipeline works — h3</p>
          </Example>

          <p className="my4">The general rule is to try to adjust font-size first, and then colour, and then weight.</p>
        </Section>

        <Section title="Examples of good contrast">
          <Example>
            <p className="h1 m0">Pipeline Settings — h1</p>
            <p className="h3 m0">Manage your how your pipeline works — h3</p>
          </Example>

          <Example>
            <p className="h2 m0">Pipeline Settings — h2</p>
            <p className="h4 m0">Manage your how your pipeline works — h4</p>
          </Example>

          <Example>
            <p className="h3 m0">Pipeline Settings — h3</p>
            <p className="h5 m0">Manage your how your pipeline works — h5</p>
          </Example>

          <Example>
            <p className="h4 m0">Pipeline Settings — h4</p>
            <p className="h5 m0 dark-gray">Manage your how your pipeline works — h5</p>
          </Example>

          <Example>
            <p className="h5 m0">Pipeline Settings — h5</p>
            <p className="h6 m0 dark-gray">Manage your how your pipeline works — h6</p>
          </Example>
        </Section>
      </div>
    );
  }
}
