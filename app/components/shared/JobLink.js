// @flow
/* eslint-disable react/prop-types */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

import Emojify from './Emojify';
import JobTitle from './JobTitle';

type Props = {
  job: {
    url: string
  },
  className: string,
  style: Object
};

class JobLink extends React.PureComponent<Props> {
  render() {
    const { job, className, style } = this.props;

    return (
      <a
        href={job.url}
        className={classNames(
          'blue hover-navy text-decoration-none hover-underline',
          className
        )}
        style={style}
      >
        <JobTitle job={job} />
      </a>
    );
  }
}

export default Relay.createContainer(JobLink, {
  fragments: {
    job: () => Relay.QL`
      fragment on JobTypeCommand {
        ${JobTitle.getFragment('job')}
        url
      }
    `
  }
});
