// @flow

import * as React from 'react';
import styled from 'styled-components';

const Status = styled.div`
  padding: 3px 4px;
  display: flex;
  align-items: center;
  border: 1px solid #DDDDDD;
  border-radius: 3px;
`;

const Label = styled.span`
  margin-left: 4px;
  color: #BBBBBB;
  text-transform: uppercase;
  font-size: 11px;
  line-height: 1;
`;

type Props = {
  showLabel?: boolean
};

export default class PipelineStatus extends React.PureComponent<Props> {
  static defaultProps = {
    showLabel: true
  }

  render() {
    return (
      <Status title="Public Pipeline">
        <svg width="17px" height="11px" viewBox="0 0 17 11" version="1.1">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M2.40224507e-14,5.5 C0.803635183,2.36191956 4.30383301,0 8.5,0 C12.696167,0 16.1963648,2.36191956 17,5.5 C16.1963648,8.63808044 12.696167,11 8.5,11 C4.30383301,11 0.803635183,8.63808044 9.96147609e-14,5.5 Z M8.5,9.9 C10.8472102,9.9 12.75,7.9300529 12.75,5.5 C12.75,3.0699471 10.8472102,1.1 8.5,1.1 C6.15278981,1.1 4.25,3.0699471 4.25,5.5 C4.25,7.9300529 6.15278981,9.9 8.5,9.9 Z" fill="#BBBBBB" />
            <circle fill="#FFFFFF" cx="8.5" cy="5.5" r="4.5" />
            <path d="M5.15421324,4.46935666 C5.4285886,5.07706618 6.03990356,5.5 6.75,5.5 C7.71649831,5.5 8.5,4.71649831 8.5,3.75 C8.5,3.03990356 8.07706618,2.4285886 7.46935666,2.15421324 C7.79518404,2.05396278 8.14129018,2 8.5,2 C10.4329966,2 12,3.56700338 12,5.5 C12,7.43299662 10.4329966,9 8.5,9 C6.56700338,9 5,7.43299662 5,5.5 C5,5.14129018 5.05396278,4.79518404 5.15421324,4.46935666 Z" fill="#BBBBBB" />
          </g>
        </svg>
        {this.props.showLabel ? <Label>PUBLIC</Label> : null}
      </Status>
    );
  }
}


