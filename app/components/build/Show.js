// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { RootContainer } from 'react-relay/classic';

import * as BuildQuery from '../../queries/Build';
import AnnotationsList from './AnnotationsList';
import Header from './Header';

declare var Buildkite: {
  JobComponent: Object,
  BuildManualJobSummaryComponent: Object,
  BuildTriggerJobSummaryComponent: Object,
  BuildWaiterJobSummaryComponent: Object
};

type Props = {
  store: {
    on: Function,
    off: Function,
    getBuild: Function
  }
};

type State = {
  build: {
    number: number,
    account: {
      slug: string
    },
    project: {
      slug: string
    },
    jobs: Array<{
      id: string,
      type: string,
      state: string
    }>
  }
};

export default class BuildShow extends React.PureComponent<Props, State> {
  static propTypes = {
    store: PropTypes.shape({
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
      getBuild: PropTypes.func.isRequired
    }).isRequired
  };

  constructor(initialProps: Props) {
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
        {this.renderJobList()}
      </div>
    );
  }

  renderJobList() {
    let lastManualJob;

    // job-list-pipeline is needed by the job components' styles
    return (
      <div className="job-list-pipeline">
        {this.state.build.jobs.map((job) => {
          if (job.state === 'broken') {
            return null;
          }

          switch (job.type) {
            case 'script':
              return (
                <Buildkite.JobComponent
                  key={job.id}
                  job={job}
                  build={this.state.build}
                  lastManualJob={lastManualJob}
                />
              );

            case 'manual':
              lastManualJob = job;
              return <Buildkite.BuildManualJobSummaryComponent key={job.id} job={job} />;

            case 'trigger':
              return <Buildkite.BuildTriggerJobSummaryComponent key={job.id} job={job} />;

            case 'waiter':
              return <Buildkite.BuildWaiterJobSummaryComponent key={job.id} job={job} />;
          }
        })}
      </div>
    );
  }
}
