import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

import CreateBuildDialog from '../CreateBuildDialog';
import Builds from './builds';

import permissions from '../../../lib/permissions';
import { repositoryProviderIcon } from '../../../lib/repositories';

class Header extends React.Component {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    buildState: PropTypes.string
  };

  state = {
    showingCreateBuildDialog: false
  };

  render() {
    return (
      <div>
        <div className="flex mb3 items-center flex-wrap">
          <div className="flex flex-auto">
            <a
              href={this.props.pipeline.url}
              className="inline-block flex-auto line-height-1 color-inherit hover-color-inherit text-decoration-none hover-lime hover-color-inherit-parent truncate"
            >
              <h4 className="semi-bold h3 m0 truncate">
                <Emojify text={this.props.pipeline.name} />
              </h4>
              <span
                className="truncate h5 regular m0 dark-gray hover-color-inherit line-height-3"
                style={{ marginTop: 3 }}
              >
                {this.renderDescription()}
              </span>
            </a>
            {this.renderProviderBadge()}
          </div>
          <Builds pipeline={this.props.pipeline} buildState={this.props.buildState} />
          <div className="flex flex-auto">
            {this.renderButtons()}
          </div>
        </div>
        <CreateBuildDialog
          isOpen={this.state.showingCreateBuildDialog}
          onRequestClose={this.handleCreateBuildDialogClose}
          pipeline={this.props.pipeline}
        />
      </div>
    );
  }

  repositoryUrl() {
    if (this.props.pipeline.repository.provider.url) {
      return this.props.pipeline.repository.provider.url;
    } else {
      return this.props.pipeline.repository.url;
    }
  }

  renderProviderBadge() {
    return (
      <a
        href={this.repositoryUrl()}
        className="flex flex-none items-center px3 black hover-lime line-height-0 text-decoration-none"
      >
        <Icon icon={repositoryProviderIcon(this.props.pipeline.repository.provider.__typename)} />
      </a>
    );
  }

  renderButtons() {
    return permissions(this.props.pipeline.permissions).collect(
      {
        allowed: "buildCreate",
        render: (idx) => (
          <Button
            key={idx}
            onClick={this.handleBuildCreateClick}
            outline={true}
            theme="default"
            className="ml2 flex items-center"
          >
            New Build
          </Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Button
            key={idx}
            href={`${this.props.pipeline.url}/settings`}
            outline={true}
            theme="default"
            className="ml2 flex items-center"
          >
            Pipeline Settings
          </Button>
        )
      }
    );
  }

  renderDescription() {
    if (this.props.pipeline.description) {
      return <Emojify text={this.props.pipeline.description} />;
    } else {
      return this.repositoryUrl();
    }
  }

  handleBuildCreateClick = () => {
    this.setState({ showingCreateBuildDialog: true });
  };

  handleCreateBuildDialogClose = () => {
    this.setState({ showingCreateBuildDialog: false });
  };
}

export default Relay.createContainer(Header, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${CreateBuildDialog.getFragment('pipeline')}
        ${Builds.getFragment('pipeline')}
        id
        name
        url
        description
        repository {
          url
          provider {
            __typename
            url
          }
        }
        permissions {
          pipelineUpdate {
            allowed
            code
            message
          }
          buildCreate {
            allowed
            code
            message
          }
        }
      }
    `
  }
});
