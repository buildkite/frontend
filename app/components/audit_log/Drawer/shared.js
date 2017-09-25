// @flow

import styled from 'styled-components';

// <Section/> is inline-block with `width: 100%`
// to prevent CSS columns from breaking inside
export const Section = styled.section.attrs({
  className: 'mb4 inline-block'
})`
  width: 100%;
`;

export const SectionHeading = styled.h3`
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
`;
