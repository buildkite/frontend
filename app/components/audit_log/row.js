import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import RevealableDownChevron from '../shared/Icon/RevealableDownChevron';
import Panel from '../shared/Panel';
import Spinner from '../shared/Spinner';
import UserAvatar from '../shared/UserAvatar';
import User from '../shared/User';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      data: PropTypes.string,
      actor: PropTypes.shape({
        name: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string.isRequired,
          avatar: PropTypes.shape({
            url: PropTypes.string.isRequired
          }).isRequired
        })
      }).isRequired,
      subject: PropTypes.shape({
        name: PropTypes.string,
        node: PropTypes.shape({
          __typename: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired
        })
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
    const actorName = this.props.auditEvent.actor.name || this.props.auditEvent.actor.node && this.props.auditEvent.actor.node.name;

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
            <div className="flex-auto flex items-center">
              {this.props.auditEvent.actor.node && (
                <div className="flex-none self-start icon-mr sm-hide md-hide lg-hide">
                  <UserAvatar
                    style={{ width: 39, height: 39 }}
                    user={this.props.auditEvent.actor.node}
                  />
                </div>
              )}
              <div className="flex-auto flex flex-wrap items-center">
                <div className="mr2">
                  <span className="inline-block black bg-white rounded border border-gray p1 monospace">
                    {this.props.auditEvent.type}
                  </span>
                  {actorName && (
                    <span className="icon-mr sm-hide md-hide lg-hide">
                      {` by `}
                      <span className="semi-bold">{actorName}</span>
                    </span>
                  )}
                </div>
                <FriendlyTime
                  className="flex-auto dark-gray"
                  value={this.props.auditEvent.occurredAt}
                />
                {this.props.auditEvent.actor.node && (
                  <User
                    user={this.props.auditEvent.actor.node}
                    align="right"
                    className="flex-none ml1 xs-hide"
                    style={{
                      maxWidth: '15em'
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex-none ml3">
              <RevealableDownChevron
                className="dark-gray"
                revealed={this.state.isExpanded}
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
          name
          node {
            ...on User {
              ${User.getFragment('user')}
              name
              avatar {
                url
              }
            }
          }
        }
        subject {
          name
          node {
            __typename
            ...on Organization {
              name
            }
            ...on Pipeline {
              name
            }
          }
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
