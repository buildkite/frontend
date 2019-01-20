// @flow

import * as React from 'react';
import Badge from 'app/components/shared/Badge';

type Props = {
  public: boolean
};

export default class PipelineStatus extends React.PureComponent<Props> {
  render() {
    if (this.props.public) {
      return (
        <div data-testid="pipeline__status">
          <Badge className="very-dark-gray" outline={true} title="Public Pipeline">Public</Badge>
        </div>
      );
    }

    return null;
  }
}