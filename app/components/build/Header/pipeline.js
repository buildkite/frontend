/* global Buildkite */

import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import Emojify from 'app/components/shared/Emojify';
import Icon from 'app/components/shared/Icon';
import Dropdown from 'app/components/shared/Dropdown';

import jobCommandOneliner from 'app/lib/jobCommandOneliner';
import BootstrapTooltipMixin from 'app/lib/BootstrapTooltipMixin';

class ParallelJobGroup {
  constructor(id) {
    this.id = id;
    this.type = "parallel_group";
    this.jobs = [];

    this.name = null;
    this.command = null;
    this.state = "scheduled";
    this.passed = null;
    this.total = null;

    this.finished = 0;
  }

  appendJob(job) {
    // Set some of the initial values based on the first job we see
    if (!this.total) {
      this.name = job.name;
      this.command = job.command;
      this.state = job.state;
      this.passed = job.passed;
      this.total = job.parallelGroupTotal;
    }

    // Keep track of jobs that haven't finished yet
    if (job.state === "finished" ||
      job.state === "waiting_failed" ||
      job.state === "blocked_failed" ||
      job.state === "canceled" ||
      job.state === "timed_out" ||
      job.state === "skipped" ||
      job.state === "broken") {
      this.finished += 1;
    }

    // If any job hasn't passed, then the entire group didn't pass
    if (!job.passed) {
      this.passed = false;
    }

    // Figure out the state of the current group
    if (this.finished === this.total) {
      this.state = "finished";
    } else if (job.state === "running" || (this.finished > 0 && (this.finished !== this.total))) {
      this.state = "running";
    }

    this.jobs.push(job);
  }
}

const BuildHeaderPipelineComponent = createReactClass({ // eslint-disable-line react/prefer-es6-class
  displayName: 'BuildHeaderPipelineComponent',

  mixins: [BootstrapTooltipMixin],

  getInitialState() {
    return { showHiddenJobs: false };
  },

  propTypes: {
    build: PropTypes.shape({
      id: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      jobs: PropTypes.arrayOf(PropTypes.shape({
        state: PropTypes.string.isRequired
      })),
      jobsCount: PropTypes.number.isRequired
    }).isRequired
  },

  render() {
    return (
      <div className="flex">
        <div className="build-pipeline-container clearfix flex-auto">
          {this.stepNodes()}
        </div>
        <div className="flex-none" style={{ paddingTop: 18 }}>
          {this.renderHiddenJobsButton()}
        </div>
      </div>
    );
  },

  renderHiddenJobsButton() {
    // Figure out how many hidden jobs we have (if any?)
    const hiddenJobsCount = this.hiddenJobsCount();
    if (hiddenJobsCount === 0) {
      return null;
    }

    const action = this.state.showHiddenJobs ? "Hide" : "Show";
    const icon = this.state.showHiddenJobs ? "eye-strikethrough" : "eye";
    const suffix = hiddenJobsCount > 1 ? "jobs" : "job";

    return (
      <button
        className="btn dark-gray hover-black regular mt0 ml0 pt0 pl0"
        onClick={this.handleToggleBrokenStepsClick}
      >
        <div
          title={`${action} ${hiddenJobsCount} hidden ${suffix}`}
          data-toggle="tooltip"
          data-animation="false"
        >
          <Icon icon={icon} className="relative" style={{ top: -3 }} />
        </div>
      </button>
    );
  },

  hiddenJobsCount() {
    return this.props.build.jobs
      .filter((job) => (
        ((job.state === 'broken') && (job.type !== 'waiter')) || job.retriedInJobUuid
      )).length;
  },

  stepNodes() {
    if (this.props.build.jobs.length === 0) {
      return (
        <p className="text-danger" style={{ margin: '10px 0 5px' }}>
          There are no build steps for this pipeline. To add a step, go to your Pipeline Settings.
        </p>
      );
    }

    let jobs = this.state.showHiddenJobs
      ? this.props.build.jobs
      : this.props.build.jobs.filter(({ state, retriedInJobUuid }) => state !== 'broken' && !retriedInJobUuid);

    if (Features.ParallelJobGroups) {
      let groupedJobs = [];
      let currentParallelGroup = null;
      for (const job of jobs) {
        // Ah! We've stumbled onto a parallel job, let's try and group it.
        if (job.parallelGroupTotal) {
          // If there's no current group being tracked, create one. If there *is*
          // one, and it's different to the current group, we'll finish off that
          // one and create a new group.
          if (!currentParallelGroup) {
            currentParallelGroup = new ParallelJobGroup(job.stepUuid);
          } else if (currentParallelGroup.id !== job.stepUuid) {
            // Only commit the parallel group if we were able to collect all
            // the jobs for it (we may only be showing a partial list of jobs)
            if (currentParallelGroup.jobs.length === currentParallelGroup.total) {
              groupedJobs.push(currentParallelGroup);
            } else {
              groupedJobs = groupedJobs.concat(currentParallelGroup.jobs);
            }

            currentParallelGroup = new ParallelJobGroup(job.stepUuid);
          }

          currentParallelGroup.appendJob(job);
        } else {
          // If this job doesn't have a `parallelGroupTotal`, and there's a
          // `currentParallelGroup` in the mix, we know we've now progressed
          // passed the group onto a new job.
          if (currentParallelGroup) {
            // Only commit the parallel group if we were able to collect all the
            // jobs for it (we may only be showing a partial list of jobs)
            if (currentParallelGroup.jobs.length === currentParallelGroup.total) {
              groupedJobs.push(currentParallelGroup);
            } else {
              groupedJobs = groupedJobs.concat(currentParallelGroup.jobs);
            }

            // We can stop tracking it now
            currentParallelGroup = null;
          }

          groupedJobs.push(job);
        }
      }

      // If there was a dangling parallel group, add it to the list of jobs to
      // render as well.
      if (currentParallelGroup) {
        // Only commit the parallel group if we were able to collect all the
        // jobs for it (we may only be showing a partial list of jobs)
        if (currentParallelGroup.jobs.length === currentParallelGroup.total) {
          groupedJobs.push(currentParallelGroup);
        } else {
          groupedJobs = groupedJobs.concat(currentParallelGroup.jobs);
        }

        currentParallelGroup = null;
      }

      jobs = groupedJobs;
    }

    const renderedJobs = jobs.map((job) => this.pipelineStep(job));

    // If the build has hidden jobs (such as on the project show / build index
    // page, we want to add a "..." build step that links to the build so you
    // can see all the steps)
    if (this.props.build.jobs.length !== this.props.build.jobsCount) {
      renderedJobs.push(
        <a
          key={`${this.props.build.id}-more-jobs`}
          href={this.props.build.path}
          className="build-pipeline-job truncate align-middle"
        >
          ...
        </a>
      );
    }

    return renderedJobs;
  },

  pipelineStep(job, inParallelGroup = false) {
    const stepClassName = this.stepClassName(job);

    const { BuildHeaderPipelineManualStepComponent, BuildHeaderPipelineTriggerStepComponent } = Buildkite;

    if (job.type === 'script') {
      if (job.state === 'broken') {
        return (
          <div
            key={job.id}
            data-toggle="tooltip"
            title={inParallelGroup ? `${this.jobName(job)} ${job.tooltip}` : job.tooltip}
            className={stepClassName}
            style={{
              maxWidth: inParallelGroup ? null : '15em'
            }}
          >
            {(
              inParallelGroup
                ? (
                  <>
                    <div style={{ flex: '0 0 16px' }}>
                      <i className={Buildkite.JobComponent.prototype.icon(job)} />
                    </div>
                    <div
                      className="ml1 rounded white semi-bold bg-white small tabular-numerals px1 border"
                      style={{
                        color: this.getLabelBackgroundColor(job),
                        borderColor: 'currentColor',
                        lineHeight: 1.75
                      }}
                    >
                      {job.parallelGroupIndex + 1}
                    </div>
                  </>
                )
                : this.jobNameNode(job)
            )}
          </div>
        );
      }

      const href = `${this.props.build.path}#${job.id}`;

      let retriedIcon;

      if (job.retriedInJobUuid) {
        retriedIcon = (
          <Icon
            icon="retry"
            style={{ height: 12, width: 12, top: -2, marginRight: 5 }}
            className="relative"
          />
        );
      }

      return (
        <a
          key={job.id}
          href={href}
          onClick={this.handleScriptJobClick(job)}
          className={stepClassName}
          title={inParallelGroup ? this.jobName(job) : null}
          style={{
            maxWidth: inParallelGroup ? null : '15em'
          }}
        >
          {retriedIcon}
          {(
            inParallelGroup
              ? (
                <>
                  <div style={{ flex: '0 0 16px', textAlign: 'center' }}>
                    <i className={Buildkite.JobComponent.prototype.icon(job)} />
                  </div>
                  <div
                    className="ml1 rounded white semi-bold bg-white small tabular-numerals px1 border"
                    style={{
                      color: this.getLabelBackgroundColor(job),
                      borderColor: 'currentColor',
                      lineHeight: 1.75
                    }}
                  >
                    {job.parallelGroupIndex + 1}
                  </div>
                </>
              )
              : this.jobNameNode(job)
          )}
        </a>
      );
    } else if (job.type === 'parallel_group') {
      return this.renderParallelGroup(job);
    } else if (job.type === 'waiter') {
      if (job.continueOnFailure) {
        return (
          <div
            key={job.id}
            className={`${stepClassName} dark-gray relative`}
            title="Wait for all previous steps to finish including failures"
          >
            <i
              className="fa fa-times absolute"
              style={{ fontSize: 12, top: 3, right: 3 }}
            />
            <Icon icon="chevron-right" style={{ height: 15, width: 15 }} />
          </div>
        );
      }

      return (
        <div
          key={job.id}
          className={`${stepClassName} dark-gray`}
          title="Wait for all previous steps to pass"
        >
          <Icon icon="chevron-right" style={{ height: 15, width: 15 }} />
        </div>
      );
    } else if (job.type === 'manual') {
      return (
        <BuildHeaderPipelineManualStepComponent
          key={job.id}
          build={this.props.build}
          job={job}
          stepClassName={stepClassName}
        />
      );
    } else if (job.type === 'trigger') {
      return (
        <BuildHeaderPipelineTriggerStepComponent
          key={job.id}
          build={this.props.build}
          job={job}
          stepClassName={stepClassName}
        />
      );
    }

    return (
      <div key={job.id} className={stepClassName}>
        {job.type}
      </div>
    );
  },

  stepClassName(job) {
    const state = job.state === 'finished' && (job.type === 'script' || job.type === 'trigger' || job.type === "parallel_group")
      ? (
        job.passed
          ? 'passed'
          : 'failed'
      )
      : job.state;

    return [
      'build-pipeline-job',
      `build-pipeline-job-${job.type.replace(/_/g, '-')}`,
      `build-pipeline-state-${state}`,
      'truncate',
      'align-middle'
    ].join(' ');
  },

  getLabelBackgroundColor(job) {
    if (job.state === "running") {
      return "#9c7c14"; // Yellow-ish
    } else if (job.state === "finished" && job.passed) {
      return "#69A770"; // Green
    } else if (job.state === "canceled" ||
                (job.state === "finished" && !job.passed)) {
      return "#a94442"; // Red
    }

    return "#afafaf"; // Gray
  },

  getWidthForParallelJobCount(parallelGroupTotal) {
    return (60 + (parallelGroupTotal.toString(10).length - 1) * 6);
  },

  idealItemsPerRow(itemCount) {
    // If we're less than 6, just use one row
    if (itemCount < 6) {
      return itemCount;
    }

    // If we've got less than 16 items, just use two rows
    if (itemCount < 16) {
      return Math.ceil(itemCount / 2);
    }

    // If we've got less than 32 items, just use four rows
    if (itemCount < 32) {
      return Math.ceil(itemCount / 4);
    }

    // Otherwise, we compute something which looks decent
    if (itemCount < 128) {
      return Math.ceil(itemCount / Math.ceil(itemCount / 10));
    }

    return Math.ceil(itemCount / Math.ceil(itemCount / 20));
  },

  renderParallelGroup(group) {
    const widthForEachJob = this.getWidthForParallelJobCount(group.total);

    const itemsPerRow = this.idealItemsPerRow(group.total);

    return (
      <Dropdown
        key={group.id}
        width={widthForEachJob * itemsPerRow + 10 + 5 * itemsPerRow - 1}
        className={this.stepClassName(group).replace("truncate", "")}
      >
        <div className="right flex items-center cursor-pointer">
          <span
            className="truncate"
            style={{
              maxWidth: "12em"
            }}
          >
            {this.jobNameNode(group)}
          </span>
          <span
            className="ml1 rounded white semi-bold small relative tabular-numerals px1"
            style={{
              backgroundColor: this.getLabelBackgroundColor(group),
              lineHeight: 1.75
            }}
          >
            {group.finished}/{group.total}
          </span>
        </div>

        <div
          className="build-pipeline-job-popup mx1 my0 tabular-numerals"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${Math.round(widthForEachJob).toString(10)}px, 1fr))`
          }}
        >
          {group.jobs.map((job) => this.pipelineStep(job, true))}
        </div>
      </Dropdown>
    );
  },

  handleScriptJobClick(job) {
    return function(evt) {
      // return if the user did a middle-click, right-click, or used a modifier
      // key (like ctrl-click, meta-click, shift-click, etc.)
      if ((evt.button !== 0) || evt.altKey || evt.ctrlKey || evt.metaKey || evt.shiftKey) {
        return;
      }

      evt.preventDefault();

      Buildkite.dispatcher.emit("job:focus", { job });
    };
  },

  jobNameNode(job) {
    if (job.name) {
      return <Emojify text={job.name} />;
    }

    return (
      <span className="monospace" style={{ fontSize: '0.9em' }}>
        {jobCommandOneliner(job.command)}
      </span>
    );
  },

  jobName(job) {
    return job.name || job.command;
  },

  handleToggleBrokenStepsClick(evt) {
    evt.preventDefault();
    evt.target.blur();
    return this.setState({ showHiddenJobs: !this.state.showHiddenJobs });
  }
});

export default BuildHeaderPipelineComponent;

