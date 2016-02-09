import React from 'react';
import PipelineIcon from './icons/Pipeline';

class PipelinesWelcome extends React.Component {
  static propTypes = {
    newUrl: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="center p4">
        <PipelineIcon />
        <h1 className="h3 m0 mt2 mb4">Create your first pipeline</h1>
        <p className='mx-auto' style={{ maxWidth: '30em' }}>Pipelines define the tasks to be run on your agents. It’s best to keep each pipeline focussed on a single part of your delivery pipeline, such as testing, deployments or infrastructure. Once created, you can connect your pipeline with your source control or trigger it via the API.</p>
        <p className='gray'>Need inspiration? See the <a href="">sample pipelines</a> GitHub repo.</p>
        <p>
          <a className="mt4 btn bg-lime hover-white white rounded" href={ this.props.newUrl }>
            New Pipeline
          </a>
        </p>
      </div>
    );
  }
}

export default PipelinesWelcome;
