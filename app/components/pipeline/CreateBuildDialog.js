import React from 'react';
import Relay from 'react-relay';

import Button from '../shared/Button';
import CollapsableArea from '../shared/CollapsableArea';
import Dialog from '../shared/Dialog';
import FormTextField from '../shared/FormTextField';
import FormTextarea from '../shared/FormTextarea';

class CreateBuildDialog extends React.PureComponent {
  static propTypes = {
    pipeline: React.PropTypes.object.isRequired,
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func
  };

  state = {
    showingOptions: false,
    creatingBuild: false
  };

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      // Focus the build message input box if the dialog was just opened. This
      // is a total hack since when this component transitions from `isOpen
      // (false => true)` the buildMessageTextField doesn't actually exist yet.
      //
      // So we'll do this hacky thing here, let this component render, then
      // focus the text field if we've got it.
      setTimeout(() => {
        if (this.buildMessageTextField) {
          this.buildMessageTextField.focus();
        }
      }, 0);
    }
  }

  render() {
    return (
      <Dialog isOpen={this.props.isOpen} onRequestClose={this.props.onRequestClose} width={400}>
        <form
          action={`/organizations/${this.props.pipeline.organization.slug}/pipelines/${this.props.pipeline.slug}/builds`}
          acceptCharset=""
          method="POST"
          ref={(form) => this.form = form}
        >

          <input type="hidden" name="utf8" value="✓" />
          <input type="hidden" name={window._csrf.param} value={window._csrf.token} />

          <div className="p4">
            <h1 className="m0 h2 semi-bold mb3">New Build</h1>

            <FormTextField
              name="build[message]"
              label="Message"
              placeholder="Description of this build"
              required={true}
              ref={(buildMessageTextField) => this.buildMessageTextField = buildMessageTextField}
            />

            <FormTextField
              name="build[commit]"
              label="Commit"
              placeholder="HEAD"
              value="HEAD"
              required={true}
            />

            <FormTextField
              name="build[branch]"
              label="Branch"
              placeholder="master"
              value="master"
              required={true}
            />

            <CollapsableArea
              label="Options"
              maxHeight={250}
              onToggle={this.handleOptionsToggle}
              collapsed={!this.state.showingOptions}
            >
              <FormTextarea
                name="build[env]"
                label="Environment Variables"
                help="Place each environment variable on a new line, in the format <code>KEY=value</code>"
                rows={3}
                tabIndex={this.state.showingOptions ? 0 : -1}
              />
              <div className="relative">
                <input type="hidden" name="build[clean_checkout]" value="0" />
                <label className="bold">
                  <input
                    className="absolute"
                    name="build[clean_checkout]"
                    type="checkbox"
                    value="1"
                    tabIndex={this.state.showingOptions ? 0 : -1}
                  />
                  {' '}
                  <span className="ml4">Clean checkout</span>
                </label>
                <div className="mb0 p0 dark-gray ml4">Force the agent to remove any existing build directory and perform a fresh checkout</div>
              </div>
            </CollapsableArea>
          </div>

          <div className="px4 pb4">
            <Button className="col-12" onClick={this.handleCreateBuildButtonClick} loading={this.state.creatingBuild ? "Creating Build..." : false}>Create Build</Button>
          </div>
        </form>
      </Dialog>
    );
  }

  handleCreateBuildButtonClick = (event) => {
    event.preventDefault();

    this.setState({ creatingBuild: true });
    this.form.submit();
  }

  handleOptionsToggle = () => {
    this.setState({ showingOptions: !this.state.showingOptions });
  }
}

export default Relay.createContainer(CreateBuildDialog, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        slug
        defaultBranch
        organization {
          slug
        }
      }
    `
  }
});
