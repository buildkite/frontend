import { css } from 'styled-components';

export const xs = (...args) => css`
  @media (max-width: 767px) {
    ${css(...args)}
  }
`;

export const sm = (...args) => css`
  @media (min-width: 768px) {
    ${css(...args)}
  }
`;

export const md = (...args) => css`
  @media (min-width: 992px) {
    ${css(...args)}
  }
`;

export const lg = (...args) => css`
  @media (min-width: 1200px) {
    ${css(...args)}
  }
`;