import React from 'react';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import Dialog from '../../shared/Dialog';
import Panel from '../../shared/Panel';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';

import TeamPipelineUpdateMutation from '../../../mutations/TeamPipelineUpdate';
import TeamPipelineDeleteMutation from '../../../mutations/TeamPipelineDelete';

import Chooser from './chooser';
import Row from './row';

const PAGE_SIZE = 10;

class Pipelines extends React.Component {
  static displayName = "Team.Pipelines";

  static propTypes = {
    team: React.PropTypes.shape({
      pipelines: React.PropTypes.shape({
        pageInfo: React.PropTypes.shape({
          hasNextPage: React.PropTypes.bool.isRequired
        }).isRequired,
        edges: React.PropTypes.array.isRequired
      }).isRequired
    }).isRequired,
    relay: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  };

  state = {
    loading: false,
    showingDialog: false
  };

  render() {
    return (
      <div>
        <Panel className={this.props.className}>
          <Panel.Header>Pipelines <Button onClick={this.handleDialogOpen}>Add Pipeline…</Button></Panel.Header>
          {this.renderPipelines()}
          {this.renderPipelineFooter()}
        </Panel>
        <Dialog
          isOpen={this.state.showingDialog}
          onRequestClose={this.handleDialogClose}
          width={350}
        >
          <Chooser team={this.props.team} />
        </Dialog>
      </div>
    );
  }

  renderPipelines() {
    if (this.props.team.pipelines.edges.length > 0) {
      return this.props.team.pipelines.edges.map((edge) => {
        return (
          <Row key={edge.node.id} teamPipeline={edge.node} onRemoveClick={this.handleTeamPipelineRemove} onAccessLevelChange={this.handleAccessLevelChange} relay={this.props.relay} />
        );
      });
    } else {
      return <Panel.Section className="dark-gray">There are no pipelines assigned to this team</Panel.Section>;
    }
  }

  renderPipelineFooter() {
    // don't show any footer if we haven't ever loaded
    // any pipelines, or if there's no next page
    if (!this.props.team.pipelines || !this.props.team.pipelines.pageInfo.hasNextPage) {
      return;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.handleLoadMorePipelinesClick}
      >
        Show more pipelines…
      </Button>
    );

    // show a spinner if we're loading more pipelines
    if (this.state.loading) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    return (
      <Panel.Footer className="center">
        {footerContent}
      </Panel.Footer>
    );
  }

  handleDialogOpen = () => {
    this.setState({ showingDialog: true });
  };

  handleDialogClose = () => {
    this.setState({ showingDialog: false });
  };

  handleLoadMorePipelinesClick = () => {
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

  handleAccessLevelChange = (teamPipeline, accessLevel, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineUpdateMutation({
      teamPipeline: teamPipeline,
      accessLevel: accessLevel
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleTeamPipelineRemove = (teamPipeline, force, callback) => {
    Relay.Store.commitUpdate(new TeamPipelineDeleteMutation({
      teamPipeline: teamPipeline,
      force: force
    }), { onSuccess: () => callback(null), onFailure: (transaction) => callback(transaction.getError()) });
  };

  handleMutationFailure = (transaction) => {
    FlashesStore.flash(FlashesStore.ERROR, transaction.getError());
  };
}

export default Relay.createContainer(Pipelines, {
  initialVariables: {
    pageSize: PAGE_SIZE
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Chooser.getFragment('team')}

        pipelines(first: $pageSize, order: NAME) {
          count
          edges {
            node {
              id
              accessLevel
              pipeline {
                id
                name
                repository {
                  url
                }
              }
              permissions {
                teamPipelineUpdate {
                  allowed
                }
                teamPipelineDelete {
                  allowed
                }
              }
              ${TeamPipelineDeleteMutation.getFragment('teamPipeline')}
              ${TeamPipelineUpdateMutation.getFragment('teamPipeline')}
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
