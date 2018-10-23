// @flow

import * as React from "react";
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

export default function TwoFactorConfigureComplete() {
  return (
    <React.Fragment>
      <Panel>
        <Panel.Header>
          Yay, you’re done!
        </Panel.Header>
        <Panel.Footer>
          <Button className="col-12" theme="success" link="/user/two-factor">
            Awesome!
          </Button>
        </Panel.Footer>
      </Panel>
    </React.Fragment>
  );
}