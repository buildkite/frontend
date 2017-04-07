import React from 'react';
import Relay from 'react-relay';
import { second } from 'metrick/duration';

import Button from '../../shared/Button';
import Panel from '../../shared/Panel';
import SearchField from '../../shared/SearchField';
import Spinner from '../../shared/Spinner';

import FlashesStore from '../../../stores/FlashesStore';

import { formatNumber } from '../../../lib/number';

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
    searchingPipelinesIsSlow: false
  };

  render() {
    return (
      <div>
        <div className="flex items-center">
          <h2 className="h2 flex-auto">Pipelines</h2>
          <Chooser team={this.props.team} />
        </div>
        <Panel className={this.props.className}>
          <div className="py2 px3">
            <SearchField
              placeholder="Search pipelines…"
              searching={this.state.searchingPipelinesIsSlow}
              onChange={this.handlePipelineSearch}
            />
          </div>
          {this.renderPipelineSearchInfo()}
          {this.renderPipelines()}
          {this.renderPipelineFooter()}
        </Panel>
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
      if (this.props.relay.variables.pipelineSearch) {
        return null;
      }
      return <Panel.Section className="dark-gray">There are no pipelines assigned to this team</Panel.Section>;
    }
  }

  renderPipelineSearchInfo() {
    const { team: { pipelines }, relay: { variables: { pipelineSearch } } } = this.props;

    if (pipelineSearch && pipelines) {
      return (
        <div className="bg-silver semi-bold py2 px3">
          <small className="dark-gray">
            {formatNumber(pipelines.count)} matching pipelines
          </small>
        </div>
      );
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

  handlePipelineSearch = (pipelineSearch) => {
    this.setState({ searchingPipelines: true });

    if (this.teamSearchIsSlowTimeout) {
      clearTimeout(this.teamSearchIsSlowTimeout);
    }

    this.teamSearchIsSlowTimeout = setTimeout(() => {
      this.setState({ searchingPipelinesIsSlow: true });
    }, 1::second);

    this.props.relay.forceFetch(
      { pipelineSearch },
      (readyState) => {
        if (readyState.done) {
          if (this.teamSearchIsSlowTimeout) {
            clearTimeout(this.teamSearchIsSlowTimeout);
          }
          this.setState({
            searchingPipelines: false,
            searchingPipelinesIsSlow: false
          });
        }
      }
    );
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
    pageSize: PAGE_SIZE,
    pipelineSearch: null
  },

  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        ${Chooser.getFragment('team')}

        pipelines(first: $pageSize, search: $pipelineSearch, order: NAME) {
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
