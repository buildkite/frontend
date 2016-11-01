import React from 'react';
import Relay from 'react-relay';
import classNames from 'classnames';

import Emojify from './Emojify';

class JobLink extends React.Component {
  static propTypes = {
    job: React.PropTypes.shape({
      label: React.PropTypes.string,
      command: React.PropTypes.string,
      url: React.PropTypes.string,
      build: React.PropTypes.shape({
        number: React.PropTypes.number,
        pipeline: React.PropTypes.shape({
          name: React.PropTypes.string
        })
      })
    }),
    className: React.PropTypes.string,
    style: React.PropTypes.object
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