import React from 'react';
import PropTypes from 'prop-types';

import Typography from './typography';

const Section = function(props) {
  return <div className="my4">{props.children}</div>;
};
Section.propTypes = {
  children: PropTypes.node
};

// Useful when authoring our base CSS styles
//
// We don't yet have a static page/route to render this, so at the moment
// you just have to insert it into pages as you need it.
//
// For example:
//
//   import CSSStyleGuide from '../../css/style-guide';
//
//   class SomeComponent extends React.Component {
//     render() {
//       return (
//         <div>
//           <CSSStyleGuide />
//         </div>
//       );
//     }
//   }
export default class CSSStyleGuide extends React.PureComponent {
  render() {
    return (
      <div>
        <Section><Typography /></Section>
      </div>
    );
  }
}