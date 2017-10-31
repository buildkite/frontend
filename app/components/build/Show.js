import React from 'react';
import { RootContainer } from 'react-relay/classic';
import CreateReactClass from 'create-react-class';

import * as BuildQuery from '../../queries/Build';
import AnnotationsList from './AnnotationsList';
import Header from './Header';

export default class BuildShow extends React.PureComponent {
  constructor(initialProps) {
    super(initialProps);

    this.state = {
      build: initialProps.store.getBuild()
    };

    // `this.props.store` is an EventEmitter which always
    // calls a given event handler in its own context 🤦🏻‍♀️
    // so let's override that!
    this.handleStoreChange = this.handleStoreChange.bind(this);
  }

  componentDidMount() {
    this.props.store.on('change', this.handleStoreChange);
  }

  componentWillUnmount() {
    this.props.store.off('change', this.handleStoreChange);
  }

  handleStoreChange = () => {
    this.setState({
      build: this.props.store.getBuild()
    });
  };

  render() {
    const build = this.state.build;

    return (
      <div>
        <Header
          build={build}
          showRebuild={true}
          showUnknownEmailPrompt={true}
        />
        <RootContainer
          Component={AnnotationsList}
          route={{
            name: 'AnnotationsRoute',
            queries: {
              build: BuildQuery.query
            },
            params: BuildQuery.prepareParams({
              organization: build.account.slug,
              pipeline: build.project.slug,
              number: build.number
            })
          }}
        />
        <div className="job-list-pipeline">
          {this.renderJobList()}
        </div>
      </div>
    );
  }

  renderJobList() {
    let lastManualJob;

    return this.state.build.jobs.map((job) => {
      if (job.state === 'broken') {
        return null;
      }

      const jobProps = {
        key: job.id,
        job: job
      };

      switch (job.type) {
        case 'script':
          return (
            <Buildkite.JobComponent
              {...jobProps}
              build={this.state.build}
              lastManualJob={lastManualJob}
            />
          );

        case 'manual':
          lastManualJob = job;
          return <Buildkite.BuildManualJobSummaryComponent {...jobProps} />;

        case 'trigger':
          return <Buildkite.BuildTriggerJobSummaryComponent {...jobProps} />;

        case 'waiter':
          return <Buildkite.BuildWaiterJobSummaryComponent {...jobProps} />;
      }
    });
  }
};
