import React from 'react';
import Relay from 'react-relay';
import Codemirror from 'react-codemirror';

import Panel from '../shared/Panel'
import Button from '../shared/Button'

require('codemirror/mode/yaml/yaml');

const value = `---
steps:
  hello: 'great'`

class Edit extends React.Component {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired
  };

  state = {
    saving: false,
    errors: null
  };

  render() {
    return (
      <Panel outline={false}>
        <Codemirror options={{mode: 'yaml', lineNumbers: true}} value={value} />

        <Panel.Footer>
          <Button loading={this.state.saving ? "Saving schedule…" : false} theme="success">Save Schedule</Button>
        </Panel.Footer>
      </Panel>
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
