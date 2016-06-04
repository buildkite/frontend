import React from 'react';
import Relay from 'react-relay';

import Panel from '../../../shared/Panel'

class Build extends React.Component {
  static propTypes = {
    build: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      url: React.PropTypes.string.isRequired,
      number: React.PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.build.id} href={this.props.build.url}>
        <div className="flex flex-stretch items-center line-height-1" style={{minHeight: '3em'}}>
          #{this.props.build.number}
        </div>
      </Panel.RowLink>
    );
  }
}

export default Relay.createContainer(Build, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        id
        url
        number
      }
    `
  }
});
