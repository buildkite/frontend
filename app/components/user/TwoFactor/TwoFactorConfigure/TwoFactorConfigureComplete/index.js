// @flow

import * as React from "react";
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

type Props = {
  onNextStep: () => void,
};

export default function TwoFactorConfigureComplete({ }: Props) {
  return (
    <React.Fragment>
      <Panel>
        <Panel.Header>
          Yay you’re done!
        </Panel.Header>
        <Panel.Footer>
          <Button className="col-12" theme="success">
            Awesome!
          </Button>
        </Panel.Footer>
      </Panel>
    </React.Fragment>
  );
}