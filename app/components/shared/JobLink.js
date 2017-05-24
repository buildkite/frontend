import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

import Emojify from './Emojify';

class JobLink extends React.Component {
  static propTypes = {
    job: PropTypes.shape({
      label: PropTypes.string,
      command: PropTypes.string,
      url: PropTypes.string,
      build: PropTypes.shape({
        number: PropTypes.number,
        pipeline: PropTypes.shape({
          name: PropTypes.string
        })
      })
    }),
    className: PropTypes.string,
    style: PropTypes.object
  };

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
        {job.build.pipeline.name} - Build #{job.build.number} / <Emojify text={job.label || job.command} />
      </a>
    );
  }
}

export default Relay.createContainer(JobLink, {
  fragments: {
    job: () => Relay.QL`
      fragment on JobTypeCommand {
        label
        command
        url
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
