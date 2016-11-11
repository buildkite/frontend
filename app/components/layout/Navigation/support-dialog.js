import React from 'react';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';

class SupportDialog extends React.Component {
  static displayName = "Navigation.SupportDialog";

  static propTypes = {
    onClose: React.PropTypes.func
  };

  render() {
    return (
      <div>
        <div className="fixed bg-white flex items-center justify-center" style={{top: 0, left: 0, bottom: 0, right: 0, zIndex: 1000, opacity: 0.9}}>
          <div className="background transition-popup rounded-2 shadow center border border-gray relative" style={{padding: "50px 20px"}}>
            <button
              className="btn absolute circle shadow bg-white bold flex items-center justify-center border border-white p0"
              style={{top: -10, right: -10, width: 30, height: 30}}
              onClick={this.props.onClose}
              >X</button>

            <h1 className="bold mt0 mb4"><Emojify text="We’re here to help :wave:"/></h1>

            <div style={{width: "50%"}} className="mx-auto mb4">
              If you have a question, problem, or just need a hand send us an email and we’ll help you out!
            </div>

            <Button href="mailto:support@buildkite.com" theme="default" outline={true}>Email support@buildkite.com</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default SupportDialog;
