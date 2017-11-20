// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Emojify from './Emojify';

type Props = {
  job: {
    label: string,
    command: string,
    build: {
      number: number,
      pipeline: {
        name: string
      }
    }
  }
};

class JobTitle extends React.PureComponent<Props> {
  render() {
    const { job, ...props } = this.props;

    return (
      <span {...props}>
        <Emojify className="semi-bold" text={job.label || job.command} />
        {` in `}
        <Emojify className="semi-bold" text={job.build.pipeline.name} />
        {` `}
        <span className="semi-bold">#{job.build.number}</span>
      </span>
    );
  }
}

export default Relay.createContainer(JobTitle, {
  fragments: {
    job: () => Relay.QL`
      fragment on JobTypeCommand {
        label
        command
        build {
          number
          pipeline {
            name
          }
        }
      }
    `
  }
});
