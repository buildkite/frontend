// @flow

import * as React from "react";
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

type Props = {
  onNextStep: () => void,
  hasExistingTotp: boolean
};

export default function TwoFactorConfigureIntroduction({ hasExistingTotp, onNextStep }: Props) {
  return (
    <React.Fragment>
      {hasExistingTotp ? (
        <Panel className="mb3 orange border-orange">
          <Panel.Section>
            <React.Fragment>
              <strong>Youʼre about to reconfigure two-factor authentication.</strong>
              <br />
              This will invalidate your existing two-factor authentication configuration and recovery codes.
            </React.Fragment>
          </Panel.Section>
        </Panel>
      ) : null}
      <Panel>
        <Panel.Header>
          Confgiure two-factor authentication
        </Panel.Header>
        <Panel.Footer>
          <Button className="col-12" theme="success" onClick={onNextStep}>
            Continue
          </Button>
        </Panel.Footer>
      </Panel>
    </React.Fragment>
  );
}