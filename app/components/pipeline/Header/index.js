import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Button from '../../shared/Button';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

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
      <div>
        <div className="flex mb3">
          <div className="flex-auto flex">
            <a className="line-height-1 color-inherit hover-color-inherit text-decoration-none flex flex-column flex-auto hover-lime hover-color-inherit-parent truncate mr3" href={this.props.pipeline.url}>
              <h4 className="inline semi-bold h3 m0 truncate">
                <Emojify text={this.props.pipeline.name} />
              </h4>
              <span className="block truncate h5 regular m0 dark-gray hover-color-inherit line-height-3" style={{ marginTop: 3 }}>
                {this.renderDescription()}
              </span>
            </a>
          </div>
          <div className="flex">
            <a href="TODO" className="flex flex-none items-center px3 black hover-lime line-height-0 text-decoration-none">
              <Icon icon="github" />
            </a>
            <Builds pipeline={this.props.pipeline} buildState={this.props.buildState} />
            {this.renderButtons()}
          </div>
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
          >New Build</Button>
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
          >Pipeline Settings</Button>
        )
      }
    );
  }

  renderDescription() {
    if (this.props.pipeline.description) {
      return (
        <Emojify text={this.props.pipeline.description} />
      );
    } else {
      if (this.props.pipeline.repository.provider.url) {
        return this.props.pipeline.repository.provider.url;
      } else {
        return this.props.pipeline.repository.url;
      }
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
