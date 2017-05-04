import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import BuildStatusDescription from '../../shared/BuildStatusDescription';
import Duration from '../../shared/Duration';
import Emojify from '../../shared/Emojify';
import UserAvatar from '../../shared/UserAvatar';

import { buildTime } from '../../../lib/builds';
import { shortMessage, shortCommit } from '../../../lib/commits';

class BuildTooltip extends React.PureComponent {
  static propTypes = {
    build: PropTypes.shape({
      commit: PropTypes.string,
      createdBy: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          url: PropTypes.string
        }).isRequired
      }),
      message: PropTypes.string,
      startedAt: PropTypes.string,
      finishedAt: PropTypes.string
    }).isRequired
  };

  render() {
    return (
      <div className="flex items-top mx2 my1">
        <div className="no-flex mr2 center">
          <UserAvatar user={this.props.build.createdBy} className="block" style={{ width: 30, height: 30 }} />
          <small className="dark-gray">
            <Duration.Micro {...buildTime(this.props.build)} tabularNumerals={false} />
          </small>
        </div>
        <div className="flex-auto line-height-2">
          <span className="block line-height-3 overflow-hidden overflow-ellipsis">
            <Emojify className="semi-bold" text={shortMessage(this.props.build.message)} /> <span className="dark-gray">{shortCommit(this.props.build.commit)}</span>
          </span>
          <small className="dark-gray">
            <BuildStatusDescription build={this.props.build} updateFrequency={0} />
          </small>
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(BuildTooltip, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        message
        url
        commit
        state
        startedAt
        finishedAt
        canceledAt
        scheduledAt
        createdBy {
          ... on User {
            name
            avatar {
              url
            }
          }
          ...on UnregisteredUser {
            name
            avatar {
              url
            }
          }
        }
      }
    `
  }
});
