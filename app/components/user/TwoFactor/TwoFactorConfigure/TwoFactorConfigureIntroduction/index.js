// @flow

import * as React from "react";
import Panel from 'app/components/shared/Panel';
import Button from 'app/components/shared/Button';

type Props = {
  handleNextStep: () => void,
  hasExistingTotp: boolean
};

export default function TwoFactorConfigureIntroduction({ hasExistingTotp, handleNextStep }: Props) {
  return (
    <React.Fragment>
      <Panel className={hasExistingTotp ? "orange border-orange" : "orange border-orange"}>
        <Panel.Section>
          {hasExistingTotp ? (
            <React.Fragment>
              <strong>Youʼre about to reconfigure two-factor authentication.</strong>
              <br />
              This will invalidate your existing two-factor authentication configuration and recovery codes.
            </React.Fragment>
          ) : (
            <React.Fragment>
              <strong>Youʼre about to reconfigure two-factor authentication.</strong>
              <br />
              This will invalidate your existing two-factor authentication configuration and recovery codes.
            </React.Fragment>
          )}
        </Panel.Section>
      </Panel>
      <Panel>
        <Panel.Header>
          Confgiure two-factor authentication
        </Panel.Header>
        <Panel.Footer>
          <Button className="col-12" theme="success" onClick={handleNextStep}>
            Continue
          </Button>
        </Panel.Footer>
      </Panel>
    </React.Fragment>
  );
}