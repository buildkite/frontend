import React from 'react';
import shuffle from 'shuffle-array';

import Dialog from '../../shared/Dialog';
import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';

const IMAGE_PADDING_HORIZONTAL = 6;
const IMAGE_PADDING_VERTICAL = 9;

const PEOPLE = [
  { image: "keithpitt", name: "Keith Pitt", bgColor: "rgb(216,138,139)" },
  { image: "harriet", name: "Harriet Lawrence", bgColor: "rgb(206,153,117)" },
  { image: "ticky", name: "Jessica Stokes", bgColor: "rgb(236,188,217)" },
  { image: "sj26", name: "Sam Cochran", bgColor: "rgb(179,166,187)" },
  { image: "toolmantim", name: "Tim Lucas", bgColor: "rgb(129,188,228)" }
];

class SupportDialog extends React.Component {
  static displayName = "Navigation.SupportDialog";

  static propTypes = {
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func
  };

  render() {
    return (
      <Dialog isOpen={this.props.isOpen} onRequestClose={this.props.onRequestClose}>
        <h1 className="bold mt0 mt2 mb4">
          <span className="animation-wave inline-block">
            <Emojify text=":wave::skin-tone-3:" />
          </span>
          {' '}
          We’re here to help!
        </h1>
        <div
          className="mb2"
          style={{
            paddingTop: IMAGE_PADDING_VERTICAL,
            paddingBottom: IMAGE_PADDING_VERTICAL,
            paddingLeft: 15 + IMAGE_PADDING_HORIZONTAL,
            paddingRight: 15 + IMAGE_PADDING_HORIZONTAL
          }}
        >
          {shuffle(PEOPLE).map((person) => (
            <img
              key={person.name}
              src={require(`../../../images/people/${person.image}-small.jpg`)}
              width={70}
              height={70}
              alt={person.name}
              title={person.name}
              className="circle border border-white"
              style={{
                backgroundColor: person.bgColor,
                borderWidth: 2,
                marginTop: -IMAGE_PADDING_VERTICAL,
                marginBottom: -IMAGE_PADDING_VERTICAL,
                marginLeft: -IMAGE_PADDING_HORIZONTAL,
                marginRight: -IMAGE_PADDING_HORIZONTAL
              }}
            />)
          )}
        </div>

        <div className="mx-auto mb2 pt1 px3 sm-col-10 semi-bold h5">
          If you have a question, problem, or just need a hand send us an email and we’ll help you out.
        </div>

        <div className="pt1">
          <Button className="h5 bold" href="mailto:support@buildkite.com" theme="default" outline={true}>Email support@buildkite.com</Button>
        </div>
      </Dialog>
    );
  }
}

export default SupportDialog;
