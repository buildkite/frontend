// @flow

import React from 'react';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

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
          'lime hover-lime text-decoration-none hover-underline',
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
