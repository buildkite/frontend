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

const renderData = (data, depth = 1) => {
  if (typeof data === 'string') {
    return data;
  }

  if (depth > 10) {
    return <i>Nesting too deep!</i>;
  }

  return (
    <dl>
      {Object.keys(data).sort().reduce(
        (accumulator, property) => (
          accumulator.concat([
            <dt
              key={`dt:${property}`}
              className="semi-bold"
            >
              {property}
            </dt>,
            <dd key={`dd:${property}`}>
              {renderData(data[property], depth + 1)}
            </dd>
          ])
        ),
        []
      )}
    </dl>
  );
};

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
      __typename: PropTypes.string.isRequired,
      uuid: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      actor: PropTypes.object,
      subject: PropTypes.object,
      context: PropTypes.object
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isExpanded: false
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
                rotate={this.state.isExpanded}
              />
            </div>
          </div>
          <TransitionMaxHeight
            className="mxn3 overflow-hidden"
            style={{
              maxHeight: this.state.isExpanded ? 1000 : 0,
              overflowY: 'auto'
            }}
          >
            <hr
              className="p0 mt2 mb0 mx0 bg-gray"
              style={{
                border: 'none',
                height: 1
              }}
            />
            <div className="mx3 mt2 mb0">
              {this.renderDetails()}
            </div>
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  renderDetails() {
    if (this.state.loading) {
      return (
        <div className="center">
          <Spinner style={{ margin: 9.5 }} />
        </div>
      );
    }

    return renderData(this.props.auditEvent);
  }

  handleHeaderClick = () => {
    const isExpanded = !this.state.isExpanded;

    this.setState({
      loading: true,
      isExpanded
    }, () => {
      this.props.relay.setVariables(
        {
          isExpanded
        },
        (readyState) => {
          if (readyState.done) {
            this.setState({ loading: false });
          }
        }
      );
    });
  };
}

export default Relay.createContainer(AuditLogRow, {
  initialVariables: {
    isExpanded: false
  },

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
        subject @include(if: $isExpanded) {
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
        context @include(if: $isExpanded) {
          __typename
          ...on AuditWebContext {
            requestIpAddress
          }
        }
      }
    `
  }
});
