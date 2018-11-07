// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay/compat';
import TeamPrivacyConstants from 'app/constants/TeamPrivacyConstants';
import Badge from 'app/components/shared/Badge';
import type { Labels_team } from './__generated__/Labels_team.graphql';

type Props = {
  team: Labels_team
};

class TeamLabels extends React.PureComponent<Props> {
  static propTypes = {
    team: PropTypes.shape({
      privacy: PropTypes.string.isRequired
    })
  }

  render() {
    if (this.props.team.privacy === TeamPrivacyConstants.SECRET) {
      return (
        <div className="flex ml1">
          <Badge outline={true} className="regular">Secret</Badge>
        </div>
      );
    }
    return null;

  }
}

export default createFragmentContainer(TeamLabels, graphql`
  fragment Labels_team on Team {
    privacy
  }
`);