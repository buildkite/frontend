import React from 'react';
import PropTypes from 'prop-types';
import shuffle from 'shuffle-array';
import styled, { keyframes } from 'styled-components';

import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import Emojify from '../../shared/Emojify';

const IMAGE_PADDING_HORIZONTAL = 6;
const IMAGE_PADDING_VERTICAL = 9;

const PEOPLE = [
  { image: "keithpitt", name: "Keith Pitt", backgroundColor: "rgb(216,138,139)" },
  { image: "harriet", name: "Harriet Lawrence", backgroundColor: "rgb(206,153,117)" },
  { image: "ticky", name: "Jessica Stokes", backgroundColor: "rgb(236,188,217)" },
  { image: "sj26", name: "Sam Cochran", backgroundColor: "rgb(179,166,187)" },
  { image: "toolmantim", name: "Tim Lucas", backgroundColor: "rgb(129,188,228)" },
  { image: "lox", name: "Lachlan Donald", backgroundColor: "rgb(149,149,143)" },
  { image: "eleanor", name: "Eleanor Kiefel Haggerty", backgroundColor: "rgb(149,149,143)" },
];

const wave = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-15deg);
  }
  to {
    transform: rotate(0deg);
  }
`;

const WavingEmoji = styled(Emojify)`
  will-change: transform;
  animation: ${wave} .3s 100ms 3 ease-in-out alternate;
  transform-origin: 70% 75%;
`;

const Mugshots = styled.div`
  padding: ${IMAGE_PADDING_VERTICAL}px ${15 + IMAGE_PADDING_HORIZONTAL}px;
`;

const Mugshot = styled.img`
  background-color: ${(props) => props.backgroundColor};
  width: 70px;
  height: 70px;
  border-width: 2px;
  margin: ${-IMAGE_PADDING_VERTICAL}px ${-IMAGE_PADDING_HORIZONTAL}px;
`;

class SupportDialog extends React.PureComponent {
  static displayName = "Navigation.SupportDialog";

  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func
  };

  render() {
    return (
      <Dialog isOpen={this.props.isOpen} onRequestClose={this.props.onRequestClose}>
        <div className="center" style={{ padding: "10% 2%" }}>
          {/* fyi the h1 class here is only necessary so this doesn't break on Bootstrap pages */}
          <h1 className="bold h1 mt0 mt2 mb4">
            <WavingEmoji className="inline-block" text=":wave::skin-tone-3:" />
            {' '}
            We’re here to help!
          </h1>
          <Mugshots className="mb2">
            {shuffle(PEOPLE).map(({ name, image, backgroundColor }) => (
              <Mugshot
                key={name}
                className="circle border border-white"
                src={require(`../../../images/people/${image}-small.jpg`)}
                alt={name}
                title={name}
                backgroundColor={backgroundColor}
              />)
            )}
          </Mugshots>

          <div className="mx-auto mb2 pt1 px3 sm-col-10 semi-bold line-height-4 h4">
            If you have a question, problem, or just need a hand send us an email and we’ll help you out.
          </div>

          <div className="pt1">
            <Button className="h4 bold" href="mailto:support@buildkite.com" theme="default" outline={true}>Email support@buildkite.com</Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default SupportDialog;
