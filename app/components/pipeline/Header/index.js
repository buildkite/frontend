// @flow

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';

import Button from '../../shared/Button';
import Dropdown from '../../shared/Dropdown';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

import CreateBuildDialog from '../CreateBuildDialog';
import Builds from './builds';

import permissions from '../../../lib/permissions';
import { repositoryProviderIcon } from '../../../lib/repositories';

const HeaderVitals = styled.div.attrs({
  className: 'flex flex-auto items-center my2'
})`
  flex-basis: 100%;

  @media (min-width: 768px) {
    flex-basis: 320px;
  }
`;

const HeaderBuilds = styled(Builds)`
  flex: 1 1 auto;
  margin-bottom: 5px;

  @media (min-width: 768px) and (max-width: 991px) {
    order: 3;
  }

  @media (min-width: 992px) {
    flex: 0 1 auto;
    margin-bottom: 0;
    margin-left: 10px;
  }
`;

type Props = {
  pipeline: Object,
  isMember: boolean,
  buildState?: string
};

type State = {
  showingActionsDropdown: boolean,
  showingCreateBuildDialog: boolean
};

class Header extends React.Component<Props, State> {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    isMember: PropTypes.bool,
    buildState: PropTypes.string
  };

  state = {
    showingActionsDropdown: false,
    showingCreateBuildDialog: false
  };

  actionsDropdown: ?Dropdown;

  componentWillMount() {
    if (window.location.hash.split('?').shift() === '#new') {
      this.setState({
        showingCreateBuildDialog: true
      });
    }
  }

  render() {
    const actions = this.getAvailableActions();

    return (
      <div>
        <div className="flex mb1 items-center flex-wrap" style={{ marginTop: -10 }}>
          <HeaderVitals>
            <div className="flex-auto">
              <a
                href={this.props.pipeline.url}
                className="inline-block line-height-1 color-inherit hover-color-inherit text-decoration-none hover-lime hover-color-inherit-parent truncate"
              >
                {this.renderPipelineName()}
                <span
                  className="truncate h5 regular m0 dark-gray hover-color-inherit line-height-3"
                  style={{ marginTop: 3 }}
                >
                  {this.renderDescription()}
                </span>
              </a>
            </div>
            {this.renderProviderBadge()}
            {this.renderDropdownForActions(actions)}
          </HeaderVitals>
          <HeaderBuilds
            pipeline={this.props.pipeline}
            buildState={this.props.buildState}
          />
          {this.renderButtonsForActions(actions)}
        </div>
        <CreateBuildDialog
          isOpen={this.state.showingCreateBuildDialog}
          onRequestClose={this.handleCreateBuildDialogClose}
          pipeline={this.props.pipeline}
        />
      </div>
    );
  }

  renderPipelineName() {
    return (
      <h4 className="semi-bold h3 m0 truncate">
        {this.props.isMember || <Emojify text={this.props.pipeline.organization.name} />}
        {this.props.isMember || <span className="dark-gray hover-color-inherit"> / </span>}
        <Emojify text={this.props.pipeline.name} />
      </h4>
    );
  }

  renderProviderBadge() {
    const uri = this.props.pipeline.repository.provider.url;

    if (!uri) {
      return null;
    }

    return (
      <a
        href={uri}
        className="flex flex-none items-center pl3 black hover-lime line-height-0 text-decoration-none"
      >
        <Icon
          title={uri}
          icon={repositoryProviderIcon(this.props.pipeline.repository.provider.__typename)}
        />
      </a>
    );
  }

  getAvailableActions() {
    // NOTE: We "render" props here so we can show near-identical
    // action lists in the dropdown and header. `children` is assumed
    // to be any renderable thing. Have at it!
    return permissions(this.props.pipeline.permissions).collect(
      {
        allowed: "buildCreate",
        render: () => ({
          key: 'newBuild',
          onClick: this.handleBuildCreateClick,
          children: 'New Build'
        })
      },
      {
        allowed: "pipelineUpdate",
        render: () => ({
          key: 'pipelineSettings',
          href: `${this.props.pipeline.url}/settings`,
          children: 'Pipeline Settings'
        })
      }
    );
  }

  renderDropdownForActions(actions) {
    if (actions.length < 1) {
      return;
    }

    const content = actions.map(({ key, ...action }) => (
      <a
        key={key}
        className="btn black hover-lime focus-lime flex items-center flex-none semi-bold"
        {...action}
        href={action.href || '#'}
      />
    ));

    return (
      <Dropdown
        className="sm-hide md-hide lg-hide ml2"
        width={200}
        ref={(actionsDropdown) => this.actionsDropdown = actionsDropdown}
        onToggle={this.handleActionsDropdownToggle}
      >
        <Button
          outline={true}
          theme="default"
          className={classNames({ lime: this.state.showingActionsDropdown })}
          iconOnly={true}
        >
          <Icon icon="down-triangle" style={{ width: 7, height: 7 }} className="flex-none" />
        </Button>
        {content}
      </Dropdown>
    );
  }

  renderButtonsForActions(actions) {
    if (actions.length < 1) {
      return;
    }

    const content = actions.map(({ key, ...action }) => (
      <Button
        key={key}
        outline={true}
        theme="default"
        className="ml2 flex items-center"
        {...action}
      />
    ));

    return (
      <div className="flex xs-hide">
        {content}
      </div>
    );
  }

  renderDescription() {
    const { pipeline } = this.props;

    if (pipeline.description) {
      return <Emojify text={pipeline.description} />;
    }

    // Hide passwords and limit to 8 dots in repository URLs
    return pipeline.repository.url.replace(
      /:([^\/@]{1,8})[^\/@]*@/,
      (match, password) => `:${password.replace(/./g, '•')}@`
    );
  }

  handleActionsDropdownToggle = (visible) => {
    this.setState({ showingActionsDropdown: visible });
  };

  handleBuildCreateClick = () => {
    if (this.state.showingActionsDropdown && this.actionsDropdown) {
      this.actionsDropdown.setShowing(false);
    }

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
        description
        url
        organization {
          name
        }
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
