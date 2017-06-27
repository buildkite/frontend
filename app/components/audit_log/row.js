import React from 'react';
import PropTypes from 'prop-types';
// import Relay, { graphql } from 'react-relay/compat';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

const RotatableIcon = styled(Icon)`
  transform: rotate(${(props) => props.rotate ? -90 : 90}deg);
  trasform-origin: center 0;
  transition: transform 200ms;
`;

export default class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvents: PropTypes.shape({
      subject: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired
    }).isRequired
  };

  state = {
    expanded: false
  };

  render() {
    return (
      <Panel.Row>
        <div>
          <div
            className="flex items-center"
            onClick={this.handleHeaderClick}
          >
            <FriendlyTime
              className="flex-none"
              value={this.props.auditEvent.occurredAt}
            />
            <span className="flex-auto flex mx2">
              <span
                className="inline-block rounded border border-gray black truncate semi-bold"
                style={{ padding: '.1em .3em' }}
              >
                {this.props.auditEvent.subject}
              </span>
            </span>
            <div className="flex-none">
              <RotatableIcon
                icon="chevron-right"
                rotate={this.state.expanded}
              />
            </div>
          </div>
          <TransitionMaxHeight
            className="mxn3 overflow-hidden"
            style={{
              maxHeight: this.state.expanded ? 500 : 0
            }}
          >
            <hr
              className="p0 mt2 mb0 mx0 bg-gray"
              style={{
                border: 'none',
                height: 1
              }}
            />
            <dl className="mx3 mt2 mb0">
              {Object.keys(this.props.auditEvent).sort().reduce(
                (accumulator, property) => (
                  accumulator.concat([
                    <dt
                      key={`dt:${property}`}
                      className="semi-bold"
                    >
                      {property}
                    </dt>,
                    <dd
                      key={`dd:${property}`}
                      className="truncate"
                    >
                      {this.props.auditEvent[property]}
                    </dd>
                  ])
                ),
                []
              )}
            </dl>
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  handleHeaderClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };
};
