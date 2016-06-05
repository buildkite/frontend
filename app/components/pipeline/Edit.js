import React from 'react';
import Relay from 'react-relay';

class Edit extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired
  };

  render() {
    return (
      <div>settings</div>
    );
  }
}

export default Relay.createContainer(Edit, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        name
      }
    `
  }
});
