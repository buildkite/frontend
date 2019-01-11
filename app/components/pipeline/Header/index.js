// @flow

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import styled from 'styled-components';
import PipelineStatus from 'app/components/shared/PipelineStatus';
import Button from 'app/components/shared/Button';
import Dropdown from 'app/components/shared/Dropdown';
import Emojify from 'app/components/shared/Emojify';
import Icon from 'app/components/shared/Icon';
import CreateBuildDialog from 'app/components/pipeline/CreateBuildDialog';
import Builds from './builds';
import defaultAvatar from 'app/images/avatar_default.png';

import permissions from 'app/lib/permissions';
import { repositoryProviderIcon } from 'app/lib/repositories';

const HeaderContent = styled.header`
  display: flex;
  flex: 1 1 auto;

  @media (max-width: 991px) {
    flex-wrap: wrap;
  }
`;

const HeaderVitals = styled.div`
  display: flex;
  flex: 1 1 auto;
  min-width: 0;

  @media (min-width: 768px) {
    flex-basis: 320px;
  }
`;

const HeaderBuilds = styled(Builds)`
  flex: 1;
  margin-bottom: 5px;

  @media (min-width: 768px) {
    white-space: nowrap;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    margin-top: 10px;
    order: 3;
  }

  @media (min-width: 992px) {
    flex: 0 0 auto;
    margin-bottom: 0;
  }
`;

type Props = {
  pipeline: Object,
  build?: Object,
  isCurrentOrganizationMember: boolean,
  buildState?: string
};

type State = {
  showingActionsDropdown: boolean,
  showingCreateBuildDialog: boolean
};

class Header extends React.Component<Props, State> {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    build: PropTypes.object,
    isCurrentOrganizationMember: PropTypes.bool,
    buildState: PropTypes.string
  };

  state = {
    showingActionsDropdown: false,
    showingCreateBuildDialog: false
  };

  actionsDropdown: ?Dropdown;

  UNSAFE_componentWillMount() {
    if (window.location.hash.split('?').shift() === '#new') {
      this.setState({
        showingCreateBuildDialog: true
      });
    }
  }

  render() {
    const actions = this.getAvailableActions();

    return (
      <div data-testid="PipelineHeader">
        <HeaderContent className="mb2">
          <HeaderVitals>
            <div className="flex flex-auto">
              {!this.props.isCurrentOrganizationMember ? (
                <a href={`/${this.props.pipeline.organization.slug}`}>
                  <img
                    src={this.props.pipeline.organization.iconUrl || defaultAvatar}
                    width="38"
                    height="38"
                    className="block circle border border-gray bg-white mr2 flex-none"
                    alt={`Icon for ${this.props.pipeline.organization.name}`}
                    title={`Icon for ${this.props.pipeline.organization.name}`}
                  />
                </a>
              ) : null}
              <div className="flex flex-column justify-center" style={{ minWidth: 0 }}>
                <div className="flex items-center">
                  <h2 className="inline-block line-height-1 h3 regular m0 mr1 line-height-2 truncate">
                    <a className="color-inherit hover-color-inherit text-decoration-none hover-lime hover-color-inherit-parent" href={`/${this.props.pipeline.organization.slug}`}>
                      <Emojify text={this.props.pipeline.organization.name} />
                    </a>
                    <span className="dark-gray"> / </span>
                    <a className="color-inherit hover-color-inherit text-decoration-none hover-lime hover-color-inherit-parent" data-testid="PipelineUrl" href={this.props.pipeline.url}>
                      <Emojify text={this.props.pipeline.name} />
                    </a>
                  </h2>
                  {this.props.pipeline.public ? <PipelineStatus showLabel={true} /> : null}
                </div>
                {this.props.pipeline.description ? (
                  <div className="dark-gray truncate">
                    <Emojify className="h4 regular" text={this.props.pipeline.description} />
                  </div>
                ) : null}
              </div>
            </div>
            {this.renderProviderBadge()}
            {this.renderDropdownForActions(actions)}
          </HeaderVitals>
          <HeaderBuilds
            testId="PipelineBuildCounts"
            pipeline={this.props.pipeline}
            buildState={this.props.buildState}
          />
          {this.renderButtonsForActions(actions)}
        </HeaderContent>
        <CreateBuildDialog
          isOpen={this.state.showingCreateBuildDialog}
          onRequestClose={this.handleCreateBuildDialogClose}
          pipeline={this.props.pipeline}
          build={this.props.build}
        />
      </div>
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
        always: true,
        and: this.props.isCurrentOrganizationMember,
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
      /:([^/@]{1,8})[^/@]*@/,
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
    build: () => Relay.QL`
      fragment on Build {
        ${CreateBuildDialog.getFragment('build')}
      }
    `,
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        ${CreateBuildDialog.getFragment('pipeline')}
        ${Builds.getFragment('pipeline')}
        id
        name
        description
        url
        public
        organization {
          name
          slug
          iconUrl
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
