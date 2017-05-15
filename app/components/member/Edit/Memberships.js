import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';

const PAGE_SIZE = 10;

class MemberEditMemberships extends React.PureComponent {
  static propTypes = {
    organizationMember: PropTypes.shape({
      teams: PropTypes.shape({
        edges: PropTypes.array.isRequired
      }).isRequired
    })
  };

  state = {
    loading: false
  };

  render() {
    const teams = this.props.organizationMember.teams.edges;
    let content;

    if (teams.length) {
      content = this.props.organizationMember.teams.edges.map(({ node }) => (
        <Panel.Section key={node.id}>
          <p className="semi-bold">
            {node.team.name}
          </p>
        </Panel.Section>
      ));
    } else {
      content = (
        <Panel.Section>
          This user is not a member of any teams.
        </Panel.Section>
      );
    }

    return (
      <div>
        <h2 className="h2">Team Memberships</h2>
        <Panel className="mb4">
          {content}
          {this.renderFooter()}
        </Panel>
      </div>
    );
  }

  renderFooter() {
    // don't show any footer if we haven't ever loaded
    // any memberships, or if there's no next page
    if (!this.props.organizationMember.teams || !this.props.organizationMember.teams.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMoreMembershipsClick}
      >
        Show more memberships…
      </Button>
    );

    // show a spinner if we're loading more members
    if (this.state.loading) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleLoadMoreMembershipsClick = () => {
    this.setState({ loading: true });

    let { pageSize } = this.props.relay.variables;

    pageSize += PAGE_SIZE;

    this.props.relay.setVariables(
      { pageSize },
      (readyState) => {
        if (readyState.done) {
          this.setState({ loading: false });
        }
      }
    );
  };
}

export default Relay.createContainer(MemberEditMemberships, {
  initialVariables: {
    pageSize: PAGE_SIZE
  },

  fragments: {
    organizationMember: () => Relay.QL`
      fragment on OrganizationMember {
        uuid
        teams(first: $pageSize) {
          edges {
            node {
              id
              team {
                name
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `
  }
});