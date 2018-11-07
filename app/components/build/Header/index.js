/* global Buildkite, jQuery */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { RootContainer } from 'react-relay/classic';

import * as BuildQuery from 'app/queries/Build';
import * as ViewerQuery from 'app/queries/Viewer';

import BuildStatusDescription from 'app/components/shared/BuildStatusDescription';
import UserAvatar from 'app/components/shared/UserAvatar';
import AvatarWithUnknownEmailPrompt from 'app/components/build/AvatarWithUnknownEmailPrompt';
import Emojify from 'app/components/shared/Emojify';

import { shortCommit } from 'app/lib/commits';

import Pipeline from './pipeline';

class BuildHeaderComponent extends React.PureComponent {
  static propTypes = {
    build: PropTypes.shape({
      number: PropTypes.number.isRequired,
      state: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      authorName: PropTypes.string,
      authorAvatar: PropTypes.string,
      authorUuid: PropTypes.string,
      project: PropTypes.shape({
        name: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      }).isRequired,
      account: PropTypes.shape({
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired
      }).isRequired,
      rebuiltFrom: PropTypes.shape({
        url: PropTypes.string.isRequired,
        number: PropTypes.number.isRequired
      }),
      triggeredFrom: PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        project: PropTypes.shape({
          name: PropTypes.string.isRequired
        }).isRequired,
        build: PropTypes.shape({
          number: PropTypes.number.isRequired
        }).isRequired
      })
    }).isRequired,
    showRebuild: PropTypes.bool,
    showProject: PropTypes.bool,
    showUnknownEmailPrompt: PropTypes.bool
  };

  componentDidMount() {
    jQuery(ReactDOM.findDOMNode(this)).on('ajax:error', this._onAjaxError); // eslint-disable-line react/no-find-dom-node
  }

  componentWillUnmount() {
    jQuery(ReactDOM.findDOMNode(this)).off('ajax:error', this._onAjaxError); // eslint-disable-line react/no-find-dom-node
  }

  _onAjaxError = (event, xhr) => {
    if (xhr.responseJSON != null) {
      alert(xhr.responseJSON['message']);
    }
  };

  bootstrapState = () => {
    switch (this.props.build.state) {
      case 'failed':
      case 'danger':
      case 'canceled':
      case 'canceling':
        return 'danger';
      case 'passed':
      case 'blocked':
        return 'success';
      case 'started':
        return 'warning';
      default:
        return 'default';
    }
  };

  icon = () => {
    switch (this.props.build.state) {
      case 'failed':
        return 'fa fa-times';
      case 'canceled':
        return 'fa fa-warning';
      case 'canceling':
        return 'fa fa-warning';
      case 'passed':
        return 'fa fa-check';
      case 'started':
        return 'fa fa-refresh fa-spin';
      case 'blocked':
        return 'fa fa-pause';
      case 'scheduled':
        return 'fa fa-clock-o';
      case 'skipped':
      case 'not_run':
        return 'fa fa-minus-square';
    }
  };

  buildInfoNode = () => {
    const { build } = this.props;

    return (
      <span className="build-header__build-number">
        <span className="number">
          <a className="no-highlight-link" href={build.path}>
            Build #{build.number}
          </a>
        </span>
      </span>
    );
  };

  commitInfoNode = () => {
    let branchNode, commitNode, pullRequestNode;
    const { build } = this.props;

    if (build.commitId) {
      if (build.commitUrl) {
        const providerIconClass = `provider-icon fa fa-${build.project.provider.id}`;
        commitNode = (<span title={build.commitId}>
          <i className={providerIconClass} />
          <a href={build.commitUrl} className="no-highlight-link">
            {shortCommit(build.commitId)}
          </a>
        </span>);
      } else {
        commitNode = (<span title={build.commitId}>
          {shortCommit(build.commitId)}
        </span>);
      }
    }

    // Do we have a branch?
    if (build.branchName) {
      branchNode = (
        <a className="no-highlight-link" href={build.branchPath}>
          {build.branchName}
        </a>
      );
    }

    if (build.pullRequest) {
      pullRequestNode = (
        <a className="no-highlight-link" href={build.pullRequest.url}>
          Pull Request #{build.pullRequest.id}
        </a>
      );
    }

    if (branchNode && commitNode && pullRequestNode) {
      return (
        <span className="build-header__build-commit">
          <span className="branch">
            {branchNode}
          </span>
          {" "}
          <code className="commit">
            {commitNode}
          </code>
          {" "}
          <span className="pull-request">
            (
            {pullRequestNode}
            )
          </span>
        </span>
      );
    } else if (branchNode && commitNode) {
      return (
        <span className="build-header__build-commit">
          <span className="branch">
            {branchNode}
          </span>
          {" "}
          <code className="commit">
            {commitNode}
          </code>
        </span>
      );
    } else if (commitNode) {
      return (
        <span className="build-header__build-commit">
          <code className="commit">
            {commitNode}
          </code>
        </span>
      );
    }

    return null;
  };

  timeAgoNode = () => {
    return (
      <small className="build-secondary-time text-muted">
        <BuildStatusDescription build={this.props.build} />
      </small>
    );
  };

  sourceLabel = (source) => {
    switch (source) {
      case 'webhook':
        return 'Webhook';
      case 'ui':
        return 'Web';
      case 'api':
        return 'API';
      case 'trigger_job':
        return 'Pipeline';
      case 'schedule':
        return 'Pipeline Schedule';
      default:
        return 'Unknown';
    }
  };

  metaInformation = () => {
    let rebuiltFromNode;
    let triggeredFromNode;

    const sourceNode = (
      <small className="text-muted">
        {`Triggered from ${this.sourceLabel(this.props.build.source)}`}
      </small>
    );

    let className = 'build-meta-info';

    if (this.props.build.rebuiltFrom) {
      className += ' with-rebuild-information';

      rebuiltFromNode = (
        <small className="text-muted">
          <br />
          {'Rebuilt from '}
          <a href={this.props.build.rebuiltFrom.url}>
            {`#${this.props.build.rebuiltFrom.number}`}
          </a>
        </small>
      );
    }

    if (this.props.build.triggeredFrom && this.props.build.triggeredFrom.url) {
      const jobName = this.props.build.triggeredFrom.name || `Job #${this.props.build.triggeredFrom.uuid}`;

      className += ' with-rebuild-information truncate';

      triggeredFromNode = (
        <small className="text-muted">
          <br />
          <a href={this.props.build.triggeredFrom.url}>
            <span>
              {this.props.build.triggeredFrom.project.name}
              {' - Build #'}
              {this.props.build.triggeredFrom.build.number}
              {' / '}
              <Emojify text={jobName} />
            </span>
          </a>
        </small>
      );
    }

    return (
      <div className={className} style={{ width: 300 }}>
        {sourceNode}
        {rebuiltFromNode}
        {triggeredFromNode}
      </div>
    );
  };

  render() {
    const { build } = this.props;

    const panelClassName = `panel panel-${this.bootstrapState()} build-panel build-state-${build.state} ${this.props.showProject ? 'mb4' : undefined}`;

    let rebuildNode;

    if (this.props.showRebuild && ((build.state === 'canceling') || build.finishedAt)) {
      if (build.permissions.rebuild.allowed) {
        rebuildNode = (
          <a
            className="twbs-btn twbs-btn-default build-rebuild-button ml2"
            data-method="post"
            href={build.rebuildPath}
            rel="nofollow"
          >
            <i className="fa fa-refresh" />
            <span>Rebuild</span>
          </a>
        );
      } else if (build.permissions.rebuild.reason !== 'anonymous') {
        rebuildNode = (
          <a
            className="twbs-btn twbs-btn-default build-rebuild-button ml2"
            data-method="post"
            disabled={true}
            href={build.rebuildPath}
            data-toggle="tooltip"
            title={build.permissions.rebuild.message}
            rel="nofollow"
          >
            <i className="fa fa-refresh" />
            <span>Rebuild</span>
          </a>
        );
      }
    }

    let cancelNode;

    const { RemoteButtonComponent, BuildMessageComponent, BuildHeaderDurationComponent } = Buildkite;

    if (build.state === 'scheduled' || build.state === 'started' || build.state === 'blocked') {
      if (build.permissions.cancel.allowed) {
        cancelNode = (
          <RemoteButtonComponent
            url={build.cancelPath}
            method="post"
            loadingText="Canceling…"
            className="twbs-btn twbs-btn-danger build-cancel-button ml2"
          >
            <span>Cancel</span>
          </RemoteButtonComponent>
        );
      } else if (build.permissions.cancel.reason !== 'anonymous') {
        cancelNode = (
          <a
            href="#"
            disabled={true}
            data-toggle="tooltip"
            title={build.permissions.cancel.message}
            className="twbs-btn twbs-btn-danger build-cancel-button ml2"
            rel="nofollow"
          >
            <span>Cancel</span>
          </a>
        );
      }
    }

    let avatarNode = this._avatarNode();
    if (avatarNode) {
      avatarNode = (
        <div className="build-author-avatar" style={{ width: 32 + 8 }}>
          {avatarNode}
        </div>
      );
    }

    let authorAndTimeNode;
    if (build.authorName) {
      authorAndTimeNode = (
        <div className="build-author">
          <div>
            {build.authorName}
          </div>

          {this.timeAgoNode()}
        </div>
      );
    } else {
      authorAndTimeNode = (
        <div className="build-author flex items-center">
          {this.timeAgoNode()}
        </div>
      );
    }

    return (
      <div>
        {this._projectNode()}
        <div className={panelClassName}>
          <div className="panel-heading clearfix">
            <div className="flex build-header-inner">
              <div className="flex-auto build-commit">
                <h3 className="panel-title">
                  <a href={build.path}>
                    <BuildMessageComponent message={build.message} />
                  </a>
                </h3>
                <div className="build-header__build-links">
                  {this.buildInfoNode()}
                  {this.commitInfoNode()}
                </div>
              </div>
              <div className="build-info flex-none flex items-center">
                <div className="build-duration mr2">
                  <BuildHeaderDurationComponent build={build} />
                </div>
                <div className="build-status-icon-container">
                  <div className="build-status-icon flex items-center justify-center">
                    <i className={this.icon()} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Pipeline build={build} />
          <div className="panel-footer" style={{ padding: '10px 13px' }}>
            <div className="flex relative">
              <div className="absolute top-0 left-0" />
              {avatarNode}
              {authorAndTimeNode}
              <div className="flex-auto">
                {this.metaInformation()}
              </div>
              {rebuildNode}
              {cancelNode}
            </div>
          </div>
        </div>
      </div>
    );
  }

  _projectNode = () => {
    if (this.props.showProject) {
      return (
        <div style={{ marginBottom: 10 }}>
          <a href={this.props.build.project.url} className="dark-gray">
            {`${this.props.build.account.name} / ${this.props.build.project.name}`}
          </a>
        </div>
      );

    }
  };

  _avatarNode = () => {
    if (!this.props.build.authorName) {
      return null;
    }

    // Only show the avatar node if `showUnknownEmailPrompt` has been turned on,
    // and we don't have an associated authorUuid (which is only present if
    // there's an actual user on the build)
    if (this.props.showUnknownEmailPrompt && !this.props.build.authorUuid) {
      return (
        <RootContainer
          Component={AvatarWithUnknownEmailPrompt}
          route={{
            name: 'BuildHeaderEmailPromptRoute',
            queries: {
              viewer: ViewerQuery.query,
              build: BuildQuery.query
            },
            params: BuildQuery.prepareParams({
              organization: this.props.build.account.slug,
              pipeline: this.props.build.project.slug,
              number: this.props.build.number
            })
          }}
        />
      );
    }

    const user = {
      name: this.props.build.authorName,
      avatar: { url: this.props.build.authorAvatar }
    };

    return (
      <UserAvatar
        user={user}
        style={{ width: 32, height: 32 }}
      />
    );
  };
}

export default BuildHeaderComponent;

