import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import styled from 'styled-components';

import Button from '../../shared/Button';
import Dropdown from '../../shared/Dropdown';
import Emojify from '../../shared/Emojify';
import Icon from '../../shared/Icon';

import CreateBuildDialog from '../CreateBuildDialog';
import Builds from './builds';

import permissions from '../../../lib/permissions';
import { repositoryProviderIcon } from '../../../lib/repositories';

const HeaderVitals = styled.div`
  flex-basis: 100%;

  @media (min-width: 768px) {
    flex-basis: 320px;
  }
`;

HeaderVitals.defaultProps = {
  className: 'flex flex-auto items-center my2'
};

const HeaderBuilds = styled(Builds)`
  flex: 1 1 auto;
  margin-bottom: 5px;

  @media (min-width: 768px) and (max-width: 991px) {
    order: 3;
  }

  @media (min-width: 992px) {
    margin-left: 10px;
    flex: 0 1 auto;
    margin-bottom: 0;
  }
`;

class Header extends React.Component {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    buildState: PropTypes.string
  };

  state = {
    showingActionsDropdown: false,
    showingCreateBuildDialog: false
  };

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
            <Dropdown
              className="sm-hide md-hide lg-hide ml2"
              width={200}
              ref={(_actionsDropdown) => this._actionsDropdown = _actionsDropdown}
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
              {this.renderDropdownItemsForActions(actions)}
            </Dropdown>
          </HeaderVitals>
          <HeaderBuilds
            pipeline={this.props.pipeline}
            buildState={this.props.buildState}
          />
          <div className="flex xs-hide">
            {this.renderButtonsForActions(actions)}
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
          onClick: this.handleBuildCreateClick,
          children: 'New Build'
        })
      },
      {
        allowed: "pipelineUpdate",
        render: () => ({
          href: `${this.props.pipeline.url}/settings`,
          children: 'Pipeline Settings'
        })
      }
    );
  }

  renderDropdownItemsForActions(actions) {
    return actions.map((action, index) => (
      <a
        key={index}
        className="btn black hover-lime focus-lime flex items-center flex-none semi-bold"
        {...action}
        href={action.href || '#'}
      />
    ));
  }

  renderButtonsForActions(actions) {
    return actions.map((action, index) => (
      <Button
        key={index}
        outline={true}
        theme="default"
        className="ml2 flex items-center"
        {...action}
      />
    ));
  }

  renderDescription() {
    if (this.props.pipeline.description) {
      return <Emojify text={this.props.pipeline.description} />;
    } else {
      return this.props.pipeline.repository.url;
    }
  }

  handleActionsDropdownToggle = (visible) => {
    this.setState({ showingActionsDropdown: visible });
  };

  handleBuildCreateClick = () => {
    if (this.state.showingActionsDropdown) {
      this._actionsDropdown.setShowing(false);
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
