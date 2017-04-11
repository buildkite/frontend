import { v4 as uuid } from 'uuid';
import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

const DisclosureTriangle = styled(Icon)`
  transform: rotate(${(props) => props.disclosed ? -90 : 90}deg);
  trasform-origin: center 0;
  transition: transform 200ms;
`;

export default class CollapsableArea extends React.Component {
  static propTypes = {
    children: React.PropTypes.node.isRequired,
    initiallyExpanded: React.PropTypes.bool,
    label: React.PropTypes.string.isRequired,
    // TODO: maxHeight is a bit of a hack, and might break for responsive
    // pages. We could instead use JS to calculate the height, and remove this
    // property altogether.
    maxHeight: React.PropTypes.number.isRequired
  };

  static defaultProps = {
    initiallyExpanded: false
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.initiallyExpanded,
      uuid: uuid()
    };
  }

  render() {
    return (
      <div>
        <button
          type="button"
          className="unstyled-button bold lime hover-dark-lime"
          aria-expanded={this.state.expanded}
          aria-controls={this.state.uuid}
          onClick={this.handleToggleOptionsButtonClick}
        >
          {this.props.label}
          <DisclosureTriangle
            disclosed={this.state.expanded}
            icon="chevron-right"
            style={{ width: 8, height: 8, marginLeft: 6, marginTop: -1 }}
          />
        </button>
        <TransitionMaxHeight
          className="relative overflow-hidden"
          aria-expanded={this.state.expanded}
          id={this.state.uuid}
          style={{ maxHeight: this.state.expanded ? this.props.maxHeight : 0 }}
        >
          <div className="pt1">
            {this.props.children}
          </div>
        </TransitionMaxHeight>
      </div>
    );
  }

  handleToggleOptionsButtonClick = (event) => {
    event.preventDefault();

    this.setState({ expanded: !this.state.expanded });
  }
}