import React from 'react';
import Relay from 'react-relay';
import shallowCompare from 'react-addons-shallow-compare';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

import CreateBuildDialog from '../CreateBuildDialog';

import permissions from '../../../lib/permissions';

class Header extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired
  };

  state = {
    showingCreateBuildDialog: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return (
      <div>
        <div className="sm-flex mb3">
          <div className="flex-auto flex">
            <a className="line-height-1 color-inherit hover-color-inherit text-decoration-none flex flex-column hover-lime hover-color-inherit-parent truncate" href={this.props.pipeline.url}>
              <h4 className="inline semi-bold h3 m0 truncate">
                <Emojify text={this.props.pipeline.name} />
              </h4>
              <span className="block truncate h5 regular m0 dark-gray hover-color-inherit line-height-3" style={{ marginTop: 3 }}>
                {this.renderDescription()}
              </span>
            </a>
            <a href={`${this.props.pipeline.url}/builds`} className="flex flex-none items-center px3 ml3 black hover-lime border-left border-gray line-height-0 text-decoration-none semi-bold">
              Builds
            </a>
            <a href="" className="flex flex-none items-center pl3 black hover-lime border-left border-gray line-height-0 text-decoration-none">
              <Icon icon="github" />
            </a>
          </div>
          <div className="flex">
            {this.renderPipelineSettingsButton()}
            {this.renderNewBuildButton()}
          </div>
        </div>
        <CreateBuildDialog isOpen={this.state.showingCreateBuildDialog} onRequestClose={this.handleSupportDialogClose} pipeline={this.props.pipeline} />
      </div>
    );
  }

            // <Button
            //   className="sm-hide md-hide lg-hide ml2"
            //   outline={true}
            //   theme="default"
            // >
            //   <Icon icon="down-triangle" style={{ width: 8, height: 8, marginTop: -2 }}  />
            // </Button>

  renderNewBuildButton() {
    return permissions(this.props.pipeline.permissions).check({
      allowed: "buildCreate",
      render: () => (
        <Button
          onClick={this.handleBuildCreateClick}
          outline={true}
          theme="default"
          className="ml3"
        >
          New Build
        </Button>
      )
    });
  }

  renderPipelineSettingsButton() {
    return permissions(this.props.pipeline.permissions).check({
      allowed: "pipelineUpdate",
      render: () => (
        // TODO: FIX THIS SHIT
        <a
          href={`${this.props.pipeline.url}/settings`}
          className="flex flex-none items-center px3 black hover-lime semi-bold line-height-0 text-decoration-none border-right border-gray"
        >
          Pipeline Settings
        </a>
      )
    });
  }

  renderDescription() {
    const repository = this.props.pipeline.repository;

    if (this.props.pipeline.description) {
      return (
        <Emojify text={this.props.pipeline.description} />
      );
    } else {
      return (
        <a
          className="color-inherit hover-color-inherit text-decoration-none hover-underline"
          href={repository.provider.url}
        >
          {repository.url}
        </a>
      );
    }
  }

  handleBuildCreateClick = () => {
    this.setState({ showingCreateBuildDialog: true });
  }

  handleSupportDialogClose = () => {
    this.setState({ showingCreateBuildDialog: false });
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${CreateBuildDialog.getFragment('pipeline')}
        id
        name
        url
        description
        repository {
          url
          provider {
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
