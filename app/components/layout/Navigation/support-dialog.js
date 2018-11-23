// @flow

import React from 'react';
import PropTypes from 'prop-types';
import shuffle from 'shuffle-array';
import styled, { keyframes } from 'styled-components';
import Button from 'app/components/shared/Button';
import Dialog from 'app/components/shared/Dialog';
import Emojify from 'app/components/shared/Emojify';

const IMAGE_DIAMETER = 70;
const IMAGE_OVERLAP_HORIZONTAL = 6;
const IMAGE_OVERLAP_VERTICAL = 9;

const MUGSHOT_AREA_PADDING_HORIZONTAL = 15 + IMAGE_OVERLAP_HORIZONTAL;
// NOTE: 480 is the width of the content area of the Dialog at full size.
const MUGSHOT_AREA_MAX_WIDTH = 480 - MUGSHOT_AREA_PADDING_HORIZONTAL * 2;

const PEOPLE = [
  { image: "keithpitt", name: "Keith Pitt", backgroundColor: "rgb(216,138,139)" },
  { image: "harriet", name: "Harriet Lawrence", backgroundColor: "rgb(206,153,117)" },
  { image: "ticky", name: "Jessica Stokes", backgroundColor: "rgb(236,188,217)" },
  { image: "sj26", name: "Sam Cochran", backgroundColor: "rgb(179,166,187)" },
  { image: "toolmantim", name: "Tim Lucas", backgroundColor: "rgb(129,188,228)" },
  { image: "lox", name: "Lachlan Donald", backgroundColor: "rgb(149,149,143)" },
  { image: "eleanor", name: "Eleanor Kiefel Haggerty", backgroundColor: "rgb(153,153,255)" },
  { image: "matthew", name: "Matthew Draper", backgroundColor: "rgb(173,196,235)" },
  { image: "justin", name: "Justin Morris", backgroundColor: "rgb(238,198,77)" }
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

const calculateRowWidth = (count) => (count * IMAGE_DIAMETER - (count - 1) * (IMAGE_OVERLAP_HORIZONTAL * 2));

const Mugshots = styled.div`
  padding: ${IMAGE_OVERLAP_VERTICAL}px ${15 + IMAGE_OVERLAP_HORIZONTAL}px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  max-width: ${({ children }) => {
    const count = React.Children.count(children);

    const minimumRows = Math.ceil(calculateRowWidth(count) / MUGSHOT_AREA_MAX_WIDTH);

    return calculateRowWidth(Math.ceil(count / minimumRows)) + MUGSHOT_AREA_PADDING_HORIZONTAL * 2;
  }}px;
`;

const Mugshot = styled.img`
  background-color: ${(props) => props.backgroundColor};
  width: ${IMAGE_DIAMETER}px;
  height: ${IMAGE_DIAMETER}px;
  border-width: 2px;
  margin: ${-IMAGE_OVERLAP_VERTICAL}px ${-IMAGE_OVERLAP_HORIZONTAL}px;
`;

type Person = {
  name: string,
  image: string,
  backgroundColor: string
};

type Props = {
  isOpen: boolean,
  onRequestClose: () => void
};

type State = {
  people: Array<Person> | null
};

export default class SupportDialog extends React.Component<Props, State> {
  static displayName = "Navigation.SupportDialog";
  static propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func
  };

  state: State = {
    people: shuffle(PEOPLE)
  };

  handleDialogHide = () => {
    this.setState({ people: shuffle(PEOPLE) });
  }

  render() {
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onRequestClose}
        onHide={this.handleDialogHide}
      >
        <div className="center" style={{ padding: "10% 2%" }}>
          {/* fyi the h1 class here is only necessary so this doesn't break on Bootstrap pages */}
          <h1 className="bold h1 mt0 mt2 mb4">
            <WavingEmoji className="inline-block" text=":wave::skin-tone-3:" />
            {' '}
            We’re here to help!
          </h1>
          <Mugshots className="mb2">
            {this.state.people && this.state.people.map(({ name, image, backgroundColor }) => (
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
