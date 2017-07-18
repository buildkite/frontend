import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Panel from '../shared/Panel';
import ShowMoreFooter from '../shared/ShowMoreFooter';
import Spinner from '../shared/Spinner';

import AuditLogRow from './row';

const PAGE_SIZE = 30;

class AuditLogList extends React.PureComponent {
  static propTypes = {
    organization: PropTypes.shape({
      name: PropTypes.string.isRequired,
      auditEvents: PropTypes.shape({
        edges: PropTypes.array.isRequired
      })
    }).isRequired,
    relay: PropTypes.object.isRequired
  };

  state = {
    loading: false
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    return (
      <Panel>
        {this.renderEvents()}
        <ShowMoreFooter
          connection={this.props.organization.auditEvents}
          loading={this.state.loading}
          onShowMore={this.handleShowMoreAuditEvents}
        />
      </Panel>
    );
  }

  renderEvents() {
    const auditEvents = this.props.organization.auditEvents;

    if (!auditEvents) {
      return (
        <Panel.Section className="center">
          <Spinner />
        </Panel.Section>
      );
    }

    if (auditEvents.edges.length > 0) {
      return auditEvents.edges.map(({ node: auditEvent }) => (
        <AuditLogRow
          key={auditEvent.id}
          auditEvent={auditEvent}
        />
      ));
    }

    return (
      <Panel.Section>
        <div className="dark-gray">
          There are no audit events
        </div>
      </Panel.Section>
    );
  }

  handleShowMoreAuditEvents = () => {
    this.setState({ loading: true });

    this.props.relay.setVariables(
      {
        pageSize: this.props.relay.variables.pageSize + PAGE_SIZE
      },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };
}

export default Relay.createContainer(AuditLogList, {
  initialVariables: {
    isMounted: false,
    pageSize: PAGE_SIZE
  },

  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        auditEvents(first: $pageSize) @include (if: $isMounted) {
          edges {
            node {
              id
              ${AuditLogRow.getFragment('auditEvent')}
            }
          }
          ${ShowMoreFooter.getFragment('connection')}
        }
      }
    `
  }
});
