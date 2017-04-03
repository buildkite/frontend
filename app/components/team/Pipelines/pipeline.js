import React from 'react';
import classNames from 'classnames';

export default class Pipeline extends React.Component {
  static displayName = "Team.Pipelines.Pipeline";

  static propTypes = {
    pipeline: React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      repository: React.PropTypes.shape({
        url: React.PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  };

  static contextTypes = {
    autoCompletorSuggestion: React.PropTypes.object
  };

  render() {
    // Toggle the `dark-gray` color on the repository text if this component is
    // in an auto completor and is highlighted.
    const autoCompletorSuggestion = this.context.autoCompletorSuggestion;
    const repositoryTextClasses = classNames(
      "truncate block",
      {
        "dark-gray": !autoCompletorSuggestion || (autoCompletorSuggestion && !autoCompletorSuggestion.selected),
        "white": (autoCompletorSuggestion && autoCompletorSuggestion.selected)
      }
    );

    return (
      <div>
        <strong className="truncate semi-bold block" title={this.props.pipeline.name}>{this.props.pipeline.name}</strong>
        <small className={repositoryTextClasses} title={this.props.pipeline.repository.url}>{this.props.pipeline.repository.url}</small>
      </div>
    );
  }
}
