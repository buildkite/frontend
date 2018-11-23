// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import { parse } from 'query-string';
import unique from 'array-unique';

import Button from 'app/components/shared/Button';
import CollapsableArea from 'app/components/shared/CollapsableArea';
import Dialog from 'app/components/shared/Dialog';
import FormTextField from 'app/components/shared/FormTextField';
import FormTextarea from 'app/components/shared/FormTextarea';
import FormDataList from 'app/components/shared/FormDataList';

type Props = {
  pipeline: Object,
  build: ?Object,
  isOpen: ?boolean,
  onRequestClose: Function
};

type State = {
  showingOptions: boolean,
  creatingBuild: boolean,
  defaultValues: {
    // putting these here so it's obvious they exist(!)
    message: ?string,
    commit: ?string,
    branch: ?string,
    env: ?string,
    clean_checkout: ?boolean
  }
};

class CreateBuildDialog extends React.PureComponent<Props, State> {
  static propTypes = {
    pipeline: PropTypes.object.isRequired,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func
  };

  state = {
    showingOptions: false,
    creatingBuild: false,
    defaultValues: {
      // putting these here so it's obvious they exist(!)
      message: undefined,
      commit: undefined,
      branch: undefined,
      env: undefined,
      clean_checkout: undefined
    }
  };

  form: ?HTMLFormElement;
  buildMessageTextField: FormTextField;
  buildCommitTextField: FormTextField;
  buildBranchTextField: FormTextField;

  componentWillMount() {
    const [hashPath, hashQuery] = window.location.hash.split('?');

    if (hashPath === '#new') {
      const newState = {};

      newState.defaultValues = parse(hashQuery);

      // expand expando area if values in expando area are non-default!
      if (newState.defaultValues.env || newState.defaultValues.clean_checkout) {
        newState.showingOptions = true;
      }

      this.setState(newState);
    }
  }

  componentDidMount() {
    // Focus the build message input box if the dialog started life opened.
    if (this.props.isOpen && this.buildMessageTextField) {
      this.buildMessageTextField.focus();
    }
  }

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
    const branchSuggestions = [this.props.pipeline.defaultBranch];
    const commitSuggestions = [this.props.pipeline.defaultCommit];

    // Add suggestions from the current build. This code is weird because Flow
    // is weird...
    if (this.props.build && this.props.build.branch) {
      branchSuggestions.push(this.props.build.branch);
    }
    if (this.props.build && this.props.build.commit) {
      commitSuggestions.push(this.props.build.commit);
    }

    // Add suggestions from the URL
    if (window.location.search) {
      const queryParams = parse(window.location.search);
      if (queryParams["branch"]) {
        branchSuggestions.push(queryParams["branch"]);
      }
      if (queryParams["commit"]) {
        commitSuggestions.push(queryParams["commit"]);
      }
    }

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
              help="Description of the build. If no message is provided, the commit message will be used"
              defaultValue={this.state.defaultValues.message || this.props.pipeline.defaultMessage}
              ref={(tf) => this.buildMessageTextField = tf}
            />

            <FormDataList
              id="new-build-commit-suggestions"
              values={unique(commitSuggestions)}
            />

            <FormTextField
              name="build[commit]"
              label="Commit"
              list="new-build-commit-suggestions"
              defaultValue={this.state.defaultValues.commit || this.props.pipeline.defaultCommit}
              ref={(tf) => this.buildCommitTextField = tf}
            />

            <FormDataList
              id="new-build-branch-suggestions"
              values={unique(branchSuggestions)}
            />

            <FormTextField
              name="build[branch]"
              label="Branch"
              list="new-build-branch-suggestions"
              defaultValue={this.state.defaultValues.branch || this.props.pipeline.defaultBranch}
              ref={(tf) => this.buildBranchTextField = tf}
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
                help={<span>Place each environment variable on a new line, in the format <code>KEY=value</code></span>}
                rows={3}
                defaultValue={this.state.defaultValues.env}
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
                    defaultChecked={this.state.defaultValues.clean_checkout === 'true'}
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

    this.form && this.form.submit();
  }

  handleOptionsToggle = () => {
    this.setState({ showingOptions: !this.state.showingOptions });
  }
}

export default Relay.createContainer(CreateBuildDialog, {
  fragments: {
    build: () => Relay.QL`
      fragment on Build {
        commit
        branch
      }
    `,
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        slug
        defaultMessage
        defaultCommit
        defaultBranch
        organization {
          slug
        }
      }
    `
  }
});
