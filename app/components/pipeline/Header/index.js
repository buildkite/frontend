import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Emojify from '../../shared/Emojify';
import Button from '../../shared/Button';

import CreateBuildDialog from '../CreateBuildDialog';
import Builds from './builds';

import permissions from '../../../lib/permissions';

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
      <div className="flex flex-wrap mb2">
        <div className="flex-auto mb1">
          <h4 className="regular h3 line-height-2 m0">
            <a className="color-inherit hover-color-inherit text-decoration-none hover-underline" href={this.props.pipeline.url}><Emojify text={this.props.pipeline.name} /></a>
          </h4>
          <div className="m0 truncate dark-gray" style={{ maxWidth: "25em", marginTop: 3 }}>
            {this.renderDescription()}
          </div>
        </div>
        <div className="flex items-start">
          <Builds pipeline={this.props.pipeline} buildState={this.props.buildState} />
          {this.renderButtons()}
        </div>
        <CreateBuildDialog isOpen={this.state.showingCreateBuildDialog} onRequestClose={this.handleSupportDialogClose} pipeline={this.props.pipeline} />
      </div>
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
          >Create Build</Button>
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
          >Settings</Button>
        )
      }
    );
  }

  renderDescription() {
    const repository = this.props.pipeline.repository;

    if (this.props.pipeline.description) {
      return (
        <Emojify text={this.props.pipeline.description} />
      );
    } else {
      const url = repository.provider.url ? repository.provider.url : repository.url;

      return (
        <a className="color-inherit hover-color-inherit text-decoration-none hover-underline" href={url}>{url}</a>
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
        ${Builds.getFragment('pipeline')}
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
