import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
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

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      data: PropTypes.string,
      actor: PropTypes.shape({
        type: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string
      }).isRequired,
      subject: PropTypes.shape({
        type: PropTypes.string.isRequired,
        uuid: PropTypes.string.isRequired,
        name: PropTypes.string
      }).isRequired,
      context: PropTypes.shape({
        __typename: PropTypes.string.isRequired,
        requestIpAddress: PropTypes.string,
        requestUserAgent: PropTypes.string,
        sessionCreatedAt: PropTypes.string
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isExpanded: false
  };

  getContextName() {
    return this.props.auditEvent.context.__typename.replace(/^Audit|Context$/g, '');
  }

  render() {
    return (
      <Panel.Row>
        <div>
          <div
            className="flex items-center cursor-pointer hover-bg-silver mxn3 py2 px3"
            style={{
              marginTop: -10,
              marginBottom: -10
            }}
            onClick={this.handleHeaderClick}
          >
            <h2 className="flex-auto flex line-height-3 font-size-1 h4 regular m0 mr2">
              {this.renderEventSentence()}
            </h2>
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
              maxHeight: this.state.isExpanded ? 1000 : 0
            }}
          >
            <hr
              className="p0 mt2 mb0 mx0 bg-gray"
              style={{
                border: 'none',
                height: 1
              }}
            />
            {this.renderEventDetails()}
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  renderEventSentence() {
    const {
      type,
      actor,
      subject,
      context
    } = this.props.auditEvent;

    const actorName = this.renderActor(actor);

    const subjectName = this.renderSubject(subject);

    let verb = type.split('_').pop().toLowerCase();
    if (type === 'ORGANIZATION_TEAMS_ENABLED') {
      verb = 'enabled teams for';
    } else if (type === 'ORGANIZATION_TEAMS_DISABLED') {
      verb = 'disabled teams for';
    }

    let cuteness;
    if (type === 'ORGANIZATION_CREATED') {
      cuteness = `🎉`;
    }

    const contextName = <span title={context.requestIpAddress} className="semi-bold">{this.getContextName()}</span>;

    const time = <FriendlyTime capitalized={false} value={this.props.auditEvent.occurredAt} />;

    return <span>{actorName} {verb} {subjectName} {cuteness} via {contextName} {time}</span>;
  }

  renderActor({ type, uuid, name }) {
    const prettyType = type.toLowerCase().replace('_', ' ');

    if (name) {
      return <span title={`${prettyType} ${uuid}`} className="semi-bold">{name}</span>;
    } else {
      return <em title={`${prettyType} ${uuid}`}>Somebody</em>;
    }
  }

  renderSubject({ type, uuid, name }) {
    const prettyType = type.toLowerCase().replace('_', ' ');

    if (name) {
      return <span title={`${prettyType} ${uuid}`}>{prettyType} <span className="semi-bold">{name}</span></span>;
    } else {
      return <span title={`${prettyType} ${uuid}`}>a {prettyType}</span>;
    }
  }

  renderEventDetails() {
    if (this.state.loading) {
      return (
        <div className="mx3 mt2 mb0 center">
          <Spinner style={{ margin: 9.5 }} />
        </div>
      );
    }

    return (
      <div className="mx3 mt2 mb0">
        <h3>Changed Data</h3>
        {this.renderEventData()}

        <h3>{this.getContextName()} Context</h3>
        <dl>
          <dt className="semi-bold">IP Address</dt>
          <dd>{this.props.auditEvent.context.requestIpAddress}</dd>
          <dt className="semi-bold">User Agent</dt>
          <dd>{this.props.auditEvent.context.requestUserAgent}</dd>
          <dt className="semi-bold">Session Started</dt>
          <dd><FriendlyTime value={this.props.auditEvent.context.sessionCreatedAt} /></dd>
        </dl>
      </div>
    );
  }

  renderEventData() {
    if (!this.props.auditEvent.data) {
      return;
    }

    const parsed = JSON.parse(this.props.auditEvent.data);

    if (parsed) {
      const rendered = JSON.stringify(parsed, null, '  ');

      // if this renders to a string longer than `{}`, show it
      if (rendered.length > 2) {
        return (
          <pre className="monospace">
            {rendered}
          </pre>
        );
      }
    }

    // otherwise, looks like there weren't any captured data changes!
    return (
      <i>No data changes were found</i>
    );
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
        uuid
        type
        occurredAt
        data @include(if: $hasExpanded)
        actor {
          type, uuid, name
        }
        subject {
          type, uuid, name
        }
        context {
          __typename
          ...on AuditWebContext {
            requestIpAddress
            requestUserAgent
            sessionCreatedAt
          }
        }
      }
    `
  }
});
