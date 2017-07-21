import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import FriendlyTime from '../shared/FriendlyTime';
import RevealableDownChevron from '../shared/Icon/RevealableDownChevron';
import Panel from '../shared/Panel';
import UserAvatar from '../shared/UserAvatar';

import AuditLogDrawer from './Drawer';

import { indefiniteArticleFor } from '../../lib/words';

import cssVariables from '../../css';

const TransitionMaxHeight = styled.div`
  transition: max-height 400ms;
`;

class AuditLogRow extends React.PureComponent {
  static propTypes = {
    auditEvent: PropTypes.shape({
      uuid: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      occurredAt: PropTypes.string.isRequired,
      actor: PropTypes.shape({
        name: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string,
          avatar: PropTypes.shape({
            url: PropTypes.string
          })
        })
      }).isRequired,
      subject: PropTypes.shape({
        type: PropTypes.string.isRequired,
        name: PropTypes.string,
        node: PropTypes.shape({
          name: PropTypes.string
        })
      }).isRequired,
      context: PropTypes.shape({
        __typename: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    isExpanded: false,
    loading: false
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
              // this is a hack to give the expandable section
              // a top border, without it taking up any space
              boxShadow: `0 1px 0 ${cssVariables['--gray']}`
            }}
            onClick={this.handleHeaderClick}
          >
            <div className="flex-auto flex items-center">
              {this.props.auditEvent.actor.node && (
                <div className="flex-none self-start icon-mr">
                  <UserAvatar
                    style={{ width: 39, height: 39 }}
                    user={this.props.auditEvent.actor.node}
                  />
                </div>
              )}
              <div className="flex-auto md-flex lg-flex items-center">
                <h2 className="flex-auto line-height-3 font-size-1 h4 regular m0">
                  <span className="semi-bold">{actorName}</span>
                  <br />
                  {this.renderEventSentence()}
                </h2>
                <FriendlyTime
                  className="flex-none dark-gray"
                  value={this.props.auditEvent.occurredAt}
                />
              </div>
            </div>
            <div className="flex-none ml2">
              <RevealableDownChevron
                className="dark-gray"
                revealed={this.state.isExpanded}
              />
            </div>
          </div>
          <TransitionMaxHeight
            className="mxn3 overflow-hidden"
            style={{
              marginBottom: -10,
              maxHeight: this.state.isExpanded ? '80vh' : 0,
              overflowY: 'auto',
              overflowScrolling: 'touch',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <AuditLogDrawer
              auditEvent={this.props.auditEvent}
              hasExpanded={this.props.relay.variables.hasExpanded}
              loading={this.state.loading}
            />
          </TransitionMaxHeight>
        </div>
      </Panel.Row>
    );
  }

  renderEventSentence() {
    const { type, subject } = this.props.auditEvent;

    // Take a guess at the verb. Usually the event type is subject type + event
    // verb, so strip off the subject type if it matches or just take the last
    // word, then sentence case the verb.

    let eventVerb;

    if (type.indexOf(`${subject.type}_`) === 0) {
      // "ORGANIZATION_TEAMS_ENABLED" with an "ORGANIZATION" subject => "TEAMS ENABLED"
      eventVerb = type.slice(subject.type.length + 1).replace('_', ' ');
    } else {
      // "PIPELINE_CREATED" => "CREATED"
      eventVerb = type.split('_').pop();
    }

    eventVerb = eventVerb.charAt(0).toUpperCase() + eventVerb.slice(1).toLowerCase();

    const renderedSubject = this.renderEventObject(subject);

    if (type === 'ORGANIZATION_CREATED') {
      // Welcome!
      return `Created ${renderedSubject} 🎉`;
    } else if (type === 'ORGANIZATION_TEAMS_ENABLED') {
      return `Enabled teams for ${renderedSubject}`;
    } else if (type === 'ORGANIZATION_TEAMS_DISABLED') {
      return `Disabled teams for ${renderedSubject}`;
    } else if (subject.type === 'TEAM_MEMBER') {
      const renderedTeam = this.renderEventObject({ type: 'TEAM', node: subject.node && subject.node.team });
      const renderedUser = this.renderEventObject({ type: 'USER', node: subject.node && subject.node.user });

      if (type === 'TEAM_MEMBER_CREATED') {
        return `Added ${renderedUser} to ${renderedTeam}`
      } else if (type === 'TEAM_MEMBER_DELETED') {
        return `Removed ${renderedUser} from ${renderedTeam}`;
      } else {
        return `${eventVerb} ${renderedUser} in ${renderedTeam}`;
      }
    } else if (subject.type === 'TEAM_PIPELINE') {
      const renderedTeam = this.renderEventObject({ type: 'TEAM', node: subject.node && subject.node.team });
      const renderedPipeline = this.renderEventObject({ type: 'PIPELINE', node: subject.node && subject.node.pipeline });

      if (type === 'TEAM_PIPELINE_CREATED') {
        return `Added ${renderedPipeline} to ${renderedTeam}`
      } else if (type === 'TEAM_PIPELINE_DELETED') {
        return `Removed ${renderedPipeline} from ${renderedTeam}`;
      } else {
        return `${eventVerb} ${renderedPipeline} in ${renderedTeam}`;
      }
    } else {
      return `${eventVerb} ${renderedSubject}`;
    }
  }

  renderEventObject({ type, name, node }) {
    // "ORGANIZATION_INVITATION" => "organzation invitation"
    const friendlyType = type && type.split('_').pop().toLowerCase();

    // Check if we can still see the node and its current name, fall back to
    // the name recorded at the time of the event if present, or just an
    // indefinite type name
    if (node && node.name) {
      return `${friendlyType} “${node.name}”`;
    } else if (name) {
      return `${friendlyType} “${name}”`;
    } else {
      return `${indefiniteArticleFor(friendlyType)} ${friendlyType}`;
    }
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
    auditEvent: ({ hasExpanded }) => Relay.QL`
      fragment on AuditEvent {
        ${AuditLogDrawer.getFragment('auditEvent', { hasExpanded })}
        uuid
        type
        occurredAt
        actor {
          name
          node {
            ...on User {
              name
              avatar {
                url
              }
            }
          }
        }
        subject {
          type
          name
          node {
            ...on Organization {
              name
            }
            ...on Pipeline {
              name
            }
            ...on Team {
              name
            }
            ...on TeamMember {
              team {
                name
              }
              user {
                name
              }
            }
            ...on TeamPipeline {
              team {
                name
              }
              pipeline {
                name
              }
            }
          }
        }
        context {
          __typename
        }
      }
    `
  }
});
