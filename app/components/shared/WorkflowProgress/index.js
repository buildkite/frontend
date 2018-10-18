// @flow

import * as React from "react";
import styled from 'styled-components';
import classNames from 'classnames';

const List = styled.ol`
  position: relative;
  padding-right: 3px;

  &:before {
    content: "";
    display: block;
    position: absolute;
    height: 1px;
    top: 11px;
    left: 12px;
    right: 12px;
    background: #ccc;
  }
`;

const Step = styled.li`
  text-align: center;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #ccc;
  outline: 3px solid #fff;
  height: 24px;
  width: 24px;
  margin-right: 24px;
  font-size: 0.65rem;
  line-height: 24px;
  z-index: 1;

  &:last-child {
    margin-right: 0;
  }
`;

const DoingStep = styled(Step)`
  border: 1px solid red;
  background: red;
`;

const DoneStep = styled(Step)`
  border: 1px solid blue;
  background: blue;
`;

export default function WorkflowProgress({ stepCount, currentStepIndex, className }) {
  const steps = [...Array(stepCount).keys()];
  return (
    <List className={classNames("flex", "list-reset", className)}>
      {steps.map((index: number) => {
        const stepIndex = index + 1;
        if (stepIndex < currentStepIndex) {
          return <DoneStep key={index} className="monospace">{stepIndex}</DoneStep>;
        }
        if (stepIndex === currentStepIndex) {
          return <DoingStep key={index} className="monospace">{stepIndex}</DoingStep>;
        }
        return <Step key={index} className="monospace">{stepIndex}</Step>;
      })}
    </List>
  );
}