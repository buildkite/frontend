import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import Icon from '../shared/Icon';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';

const renderData = (data, depth = 0) => {
  if (typeof data === 'string') {
    return data;
  }

  if (depth > 10) {
    return <i>Nesting too deep!</i>;
  }

  if (!data) {
    return "" + data;
  }

  const keys = Object.keys(data).sort();

  if (!keys.length) {
    return data.toStri;
  }

  return (
    <dl>
      {keys.reduce(
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
      data: PropTypes.string,
      actor: PropTypes.object.isRequired,
      subject: PropTypes.object.isRequired,
      context: PropTypes.object.isRequired
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
            <span className="flex-auto flex mr2">
              {this.renderEventSentence()}
            </span>
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

  renderEventSentence() {
    const {
      __typename: eventTypeName,
      actor,
      subject,
      context
    } = this.props.auditEvent;

    const eventTypeSplit = eventTypeName
      .replace(/^Audit|Event$/g, '')
      .replace(/(^|[a-z0-9])([A-Z][a-z0-9])/g, '$1 $2')
      .split(/\s+/);

    const eventVerb = eventTypeSplit.pop().toLowerCase();

    const eventType = eventTypeSplit.join(' ');

    let subjectName = subject.name;

    if (eventTypeName === 'AuditOrganizationCreatedEvent') {
      subjectName = `${subjectName} 🎉`;
    }

    const contextName = context.__typename.replace(/^Audit|Context$/g, '');

    return (
      <span>
        <span className="semi-bold">{actor.name}</span>
        {` ${eventVerb} ${eventType} `}
        <span className="semi-bold">{subjectName}</span>
        {` via `}
        <span
          title={context.requestIpAddress}
          className="semi-bold"
        >
          {contextName}
        </span>
        {` `}
        <FriendlyTime
          capitalized={false}
          value={this.props.auditEvent.occurredAt}
        />
      </span>
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

    if (!this.props.auditEvent.data) {
      return;
    }

    return renderData(JSON.parse(this.props.auditEvent.data)) || <i>No changes</i>;
  }

  handleHeaderClick = () => {
    const isExpanded = !this.state.isExpanded;

    this.setState({
      loading: true,
      isExpanded
    }, () => {
      this.props.relay.setVariables(
        {
          hasExpanded: true
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
    hasExpanded: false
  },

  fragments: {
    auditEvent: () => Relay.QL`
      fragment on AuditEvent {
        __typename
        uuid
        occurredAt
        data @include(if: $hasExpanded)
        actor {
          __typename
          ...on User {
            uuid
            name
          }
        }
        subject {
          __typename
          ...on Organization {
            slug
            name
          }
          ...on Pipeline {
            slug
            name
            organization {
              slug
            }
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
