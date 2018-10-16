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
      <Panel className={hasExistingTotp ? "orange border-orange" : ""}>
        <Panel.Section>
          {hasExistingTotp ? (
            <React.Fragment>
              <strong>Youʼre about to reconfigure two-factor authentication.</strong>
              <br />
              This will replace your existing two-factor authentication applications and recovery codes.
            </React.Fragment>
          ) : (
            <React.Fragment>
              <strong>Youʼre about to reconfigure two-factor authentication.</strong>
              <br />
              This will replace your existing two-factor authentication applications and recovery codes.
            </React.Fragment>
          )}
        </Panel.Section>
        <Panel.Section>
          <Button className="col-12" theme="success" onClick={handleNextStep}>
            Continue
          </Button>
        </Panel.Section>
      </Panel>
    </React.Fragment>
  );
}