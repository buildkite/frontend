// @flow

import * as React from 'react';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import BuildStatusDescription from 'app/components/shared/BuildStatusDescription';
import Duration from 'app/components/shared/Duration';
import Emojify from 'app/components/shared/Emojify';
import UserAvatar from 'app/components/shared/UserAvatar';
import { buildTime } from 'app/lib/builds';
import { shortMessage, shortCommit } from 'app/lib/commits';

import type { BuildTooltip_build } from './__generated__/BuildTooltip_build.graphql';

type Props = {
  build: BuildTooltip_build
};

class BuildTooltip extends React.PureComponent<Props> {
  render() {
    const { createdBy } = this.props.build;

    return (
      <div className="flex items-top mx2 my1">
        <div className="no-flex mr2 center">
          {createdBy ? (
            <UserAvatar
              user={{
                avatar: createdBy.avatar,
                name: createdBy.name || createdBy.maybeName
              }}
              className="block"
              style={{ width: 30, height: 30 }}
            />
          ) : null}
          <small className="dark-gray">
            <Duration.Micro {...buildTime(this.props.build)} tabularNumerals={false} />
          </small>
        </div>
        <div className="flex-auto line-height-2">
          <span className="block line-height-3 overflow-hidden overflow-ellipsis">
            <Emojify className="semi-bold mr1" text={shortMessage(this.props.build.message)} />
            <span className="dark-gray monospace">{shortCommit(this.props.build.commit)}</span>
          </span>
          <small className="dark-gray">
            <BuildStatusDescription build={this.props.build} updateFrequency={0} />
          </small>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(BuildTooltip, graphql`
  fragment BuildTooltip_build on Build {
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
        maybeName: name
        avatar {
          url
        }
      }
    }
  }
`);
