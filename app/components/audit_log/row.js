import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';
import User from '../shared/User';

import { uncamelise } from '../../lib/strings';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

const RotatableIcon = styled(Icon)`
  transform: rotate(${(props) => props.rotate ? -90 : 90}deg);
  trasform-origin: center 0;
  transition: transform 200ms;
`;

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      actor: PropTypes.object.isRequired,
      subject: PropTypes.object.isRequired
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
                {uncamelise(this.props.auditEvent.__typename.replace(/^Audit|Event$/g, ''))}
              </span>
            </span>
            {this.props.auditEvent.actor &&
              <User
                className="mr2"
                align="right"
                user={this.props.auditEvent.actor}
              />
            }
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
                      <pre>{JSON.stringify(this.props.auditEvent[property], null, '  ')}</pre>
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

export default Relay.createContainer(AuditLogRow, {
  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
        __typename
        uuid
        occurredAt
        actor {
          __typename
          ...on User {
            ${User.getFragment('user')}
          }
        }
        subject {
          __typename
          ...on Organization {
            id
            name
          }
          ...on Pipeline {
            id
            name
          }
        }
        context {
          __typename
          ...on AuditWebContext {
            requestIpAddress
          }
        }
      }
    `
  }
});
