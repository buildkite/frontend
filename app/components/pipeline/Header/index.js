import classNames from 'classnames';
import React from 'react';
import Relay from 'react-relay';
import styled from 'styled-components';

import * as breakpoints from '../../shared/breakpoints';
import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

import CreateBuildDialog from '../CreateBuildDialog';
import Builds from './builds';

import permissions from '../../../lib/permissions';

// const ActionButtonsContainer = styled.div`
//   border: solid green 2px;
//   ${breakpoints.md`border: solid red 10px;`}
// `;

class Header extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    buildState: React.PropTypes.string
  };

  state = {
    showingCreateBuildDialog: false
  };

  render() {
    return (
      <div className="md-flex mb3">
        <div className="mr-auto">
          <h4 className="regular h4 line-height-2 m0 truncate" style={{ maxWidth: '100%' }}>
            <a className="color-inherit hover-color-inherit text-decoration-none hover-underline" href={this.props.pipeline.url}><Emojify text={this.props.pipeline.name} /></a>
          </h4>
          <div className="m0 truncate dark-gray" style={{ maxWidth: "25em", marginTop: 3 }}>
            {this.renderDescription()}
          </div>
        </div>
        <div className="flex items-center">
          <Builds pipeline={this.props.pipeline} buildState={this.props.buildState} />
          <div className="xs-hide sm-hide md-flex">
            {this.renderButtons('ml2')}
          </div>
          <Button
            className="md-hide lg-hide ml2"
            outline={true}
            theme="default">
            <Icon icon="down-triangle" style={{ width: 8, height: 8, marginTop: -2 }}  />
          </Button>
        </div>
        <CreateBuildDialog isOpen={this.state.showingCreateBuildDialog} onRequestClose={this.handleSupportDialogClose} pipeline={this.props.pipeline} />
      </div>
    );
  }

  renderButtons(className) {
    const buttons = permissions(this.props.pipeline.permissions).collect(
      {
        allowed: "buildCreate",
        render: (idx) => (
          <Button
            key={idx}
            onClick={this.handleBuildCreateClick}
            outline={true}
            theme="default"
            className={className}
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
            className={className}
          >
            Settings
          </Button>
        )
      }
    );

    return (
      <div>
        {buttons}
      </div>
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
