import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import classNames from 'classnames';

import BuildState from '../icons/BuildState';
import BuildStates from '../../constants/BuildStates';

import Emojify from './Emojify';

class JobLink extends React.PureComponent {
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
    style: PropTypes.object,
    showState: PropTypes.bool.isRequired
  };

  static defaultProps = {
    showState: false
  };

  getBuildStateForJob(job) {
    // Naïvely transliterate Job state to Build state
    switch (job.state) {
      case "FINISHED":
        return (
          job.passed
            ? BuildStates.PASSED
            : BuildStates.FAILED
        );
      case "PENDING":
      case "WAITING":
      case "UNBLOCKED":
      case "LIMITED":
      case "ASSIGNED":
      case "ACCEPTED":
        return BuildStates.SCHEDULED;
      case "TIMING_OUT":
      case "TIMED_OUT":
      case "WAITING_FAILED":
      case "BLOCKED_FAILED":
      case "UNBLOCKED_FAILED":
      case "BROKEN":
        return BuildStates.FAILED;
      default:
        return job.state;
    }
  }

  render() {
    const { job, className, showState, style } = this.props;

    return (
      <a
        href={job.url}
        className={classNames(
          'blue hover-navy text-decoration-none hover-underline',
          className
        )}
        style={style}
      >
        {showState &&
          <BuildState.XSmall
            state={this.getBuildStateForJob(job)}
            style={{ marginRight: '.4em' }}
          />
        }
        <Emojify text={job.build.pipeline.name} />
        {` - Build #${job.build.number} / `}
        <Emojify text={job.label || job.command} />
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
        state
        passed
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
