import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shuffle from 'shuffle-array';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

const PEOPLE = [
  { image: "keithpitt", name: "Keith Pitt" },
  { image: "harriet", name: "Harriet Lawrence" },
  { image: "ticky", name: "Jessica Stokes" },
  { image: "sj26", name: "Sam Cochran" },
  { image: "toolmantim", name: "Tim Lucas" }
]

class SupportDialog extends React.Component {
  static displayName = "Navigation.SupportDialog";

  static propTypes = {
    onClose: React.PropTypes.func
  };

  state = {
    visible: false
  };

  componentDidMount() {
    this.setState({ visible: true });
  }

  render() {
    return (
      <div className="fixed flex items-center justify-center" style={{top: 0, left: 0, bottom: 0, right: 0, zIndex: 1000}}>
        <ReactCSSTransitionGroup transitionName="transition-popup" transitionEnterTimeout={150} transitionLeaveTimeout={150}>
          {this.renderDialog()}
        </ReactCSSTransitionGroup>

        <div className="absolute bg-white" style={{top: 0, left: 0, bottom: 0, right: 0, zIndex: 1001, opacity: 0.9}} />
      </div>
    );
  }

  renderDialog() {
    if(!this.state.visible) {
      return null;
    }

    return (
      <div className="background bg-white transition-popup rounded-2 shadow center relative" style={{padding: "50px 10px", zIndex: 1002, width: 500}}>
        <button className="btn absolute circle shadow bg-white bold flex items-center justify-center border border-white p0" style={{top: -10, right: -10, width: 30, height: 30}} onClick={this.props.onClose}>
          <Icon icon="close" title="Close"/>
        </button>

        <h1 className="bold mt0 mb4"><Emojify text="We’re here to help :wave:"/></h1>
        <div className="mb4 pt3">{shuffle(PEOPLE).map((person) => this.renderPerson(person))}</div>
        <div className="mx-auto mb4 pt1" style={{ width: "50%" }}>If you have a question, problem, or just need a hand send us an email and we’ll help you out!</div>

        <div className="pt1">
          <Button href="mailto:support@buildkite.com" theme="default" outline={true}>Email support@buildkite.com</Button>
        </div>
      </div>
    )
  }

  renderPerson(person) {
    return (
      <img key={person.name} src={require(`../../../images/people/${person.image}.jpg`)} width={70} height={70} alt={person.name} title={person.name} className="circle border border-white" style={{marginLeft: -5}} />
    );
  }
}

export default SupportDialog;
