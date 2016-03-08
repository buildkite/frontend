import React from 'react';
import classNames from 'classnames';

class Pipeline extends React.Component {
  static displayName = "Team.Pipelines.Pipeline";

  static contextTypes = {
    autoCompletorSuggestion: React.PropTypes.object
  };

  render() {
    // Toggle the `dark-gray` color on the repository text if this component is
    // in an auto completor and is highlighted.
    let autoCompletorSuggestion = this.context.autoCompletorSuggestion;
    let repositoryTextClasses = classNames({
      "dark-gray": !autoCompletorSuggestion || (autoCompletorSuggestion && !autoCompletorSuggestion.selected),
      "white": (autoCompletorSuggestion && autoCompletorSuggestion.selected)
    });

    return (
      <div>
	<strong className="semi-bold block">{this.props.pipeline.name}</strong>
	<small className={repositoryTextClasses}>{this.props.pipeline.repository}</small>
      </div>
    );
  }
}

export default Pipeline;
