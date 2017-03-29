import React from 'react';
import Relay from 'react-relay';

import Menu from '../shared/Menu';
import Icon from '../shared/Icon';

import permissions from '../../lib/permissions';

class SettingsMenu extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired
  };

  get provider() {
    return this.props.pipeline.repository.provider;
  }

  render() {
    const url = `/${this.props.pipeline.organization.slug}/${this.props.pipeline.slug}/settings`;

    return (
      <div>
        <Menu>
          <Menu.Header>Settings</Menu.Header>
          {this.renderButtons(url)}
        </Menu>

        <Menu>
          <Menu.Button href={`${url}/email-preferences`}>
            <Icon icon="emails" className="icon-mr"/>Your Email Preferences
          </Menu.Button>
        </Menu>
      </div>
    );
  }

  renderButtons(url) {
    return permissions(this.props.pipeline.permissions).collect(
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`${url}`} active={this.isPipelineButtonActive(url)}>
            <Icon icon="pipeline" className="icon-mr"/>Pipeline
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`${url}/name-and-description`}>
            <Icon icon="settings" className="icon-mr"/>Name &amp; Description
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`${url}/queues`}>
            <Icon icon="queing" className="icon-mr"/>Queues
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`${url}/repository`}>
            <Icon icon={this.repositoryProviderIcon()} className="icon-mr"/>{this.providerLabel()}
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} link={`${url}/teams`} badge={this.props.pipeline.teams.count}>
            <Icon icon="teams" className="icon-mr"/>Teams
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} link={`${url}/schedules`} badge={this.props.pipeline.schedules.count}>
            <Icon icon="schedules" className="icon-mr"/>Schedules
          </Menu.Button>
        )
      },
      {
        allowed: "pipelineUpdate",
        render: (idx) => (
          <Menu.Button key={idx} href={`${url}/badges`}>
            <Icon icon="badges" className="icon-mr"/>Badges
          </Menu.Button>
        )
      }
    );
  }

  providerLabel() {
    if (this.provider.__typename === "RepositoryProviderUnknown") {
      return "Repository";
    } else {
      return this.provider.name;
    }
  }

  repositoryProviderIcon() {
    if (this.provider.__typename === "RepositoryProviderGithub") {
      return "github";
    } else {
      return "blah";
    }
  }

  isPipelineButtonActive(url) {
    // We need to override the default `active` handling the Pipelines button
    // since by default, `Menu.Button` will show a button as active if part of
    // it's URL is present in the URL. The but URL for the Pipelines button is
    // present in _all_ URLs
    return window.location.pathname === url;
  }
}

export default Relay.createContainer(SettingsMenu, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
        slug
        organization {
          slug
        }
        repository {
          provider {
            __typename
            name
          }
        }
        teams {
          count
        }
        schedules {
          count
        }
        permissions {
          pipelineUpdate {
            allowed
          }
        }
      }
    `
  }
});
