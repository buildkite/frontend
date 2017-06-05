import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import FriendlyTime from '../../../shared/FriendlyTime';
import Panel from '../../../shared/Panel';

class Build extends React.PureComponent {
  static propTypes = {
    build: PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      number: PropTypes.number.isRequired,
      createdAt: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.build.id} href={this.props.build.url}>
        <div className="flex flex-stretch items-center line-height-1" style={{ minHeight: '3em' }}>
          <span className="mr-auto">Build #{this.props.build.number}</span>
          <span className="dark-gray regular mr2 flex-none"><FriendlyTime value={this.props.build.createdAt} /></span>
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
        createdAt
      }
    `
  }
});
