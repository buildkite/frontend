// @flow

import * as React from 'react';
import Badge from 'app/components/shared/Badge';

type Props = {
  forumTopicUrl: string
};

export default class BetaBadge extends React.PureComponent<Props> {
  render() {
    return (
      <a title="Community Forum Topic" href={this.props.forumTopicUrl}>
        <Badge outline={true} className="btn-outline bg-white regular very-dark-gray">
          Beta
        </Badge>
      </a>
    );
  }
}
