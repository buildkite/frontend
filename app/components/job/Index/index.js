import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';

import Panel from '../../shared/Panel';
import Button from '../../shared/Button';
import PageHeader from '../../shared/PageHeader';
import PageWithContainer from '../../shared/PageWithContainer';

import Jobs from './jobs';
import SearchInput from './search-input';

class JobIndex extends React.Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
    location: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor(initialProps) {
    super(initialProps);

    // Figure out if the default query
    const query = this.props.location.query.q !== undefined ? this.props.location.query.q : "state:scheduled";
    this.state = { query: query, searchInputValue: query };
  }

  componentWillReceiveProps(nextProps) {
    // When the `q` param in the URL changes, do a new search
    const query = nextProps.location.query.q;
    if (query !== undefined && this.state.query !== query){
      this.setState({ query: query, searchInputValue: query });
    }
  }

  render() {
    return (
      <PageWithContainer>
        <PageHeader>
          <PageHeader.Title>Jobs</PageHeader.Title>
        </PageHeader>

        <Panel className="mb4">
          <Panel.Section>
            <form onSubmit={this.handleFormSubmit} className="flex items-stretch">
              <SearchInput value={this.state.searchInputValue} onChange={this.handleSearchInputChange} />
              <Button outline={true} theme="default" className="ml3">Search</Button>
            </form>

            <div className="dark-gray mt1">
              You can further filter jobs using <code>state:scheduled</code> or <code>concurrency-group:custom-group</code>
            </div>
          </Panel.Section>
        </Panel>

        <Jobs
          query={this.state.query}
          organization={this.props.organization}
          onSuggestionClick={this.handleSuggestionClick}
        />
      </PageWithContainer>
    );
  }

  handleSearchInputChange = (event) => {
    this.setState({ searchInputValue: event.target.value });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();

    this.context.router.push(`/organizations/${this.props.organization.slug}/jobs?q=${this.state.searchInputValue}`);
  };

  handleSuggestionClick = (suggestion) => {
    const query = `${this.state.searchInputValue} ${suggestion}`;

    this.context.router.push(`/organizations/${this.props.organization.slug}/jobs?q=${query}`);
  };
}

export default Relay.createContainer(JobIndex, {
  fragments: {
    organization: () => Relay.QL`
      fragment on Organization {
        name
        slug
        ${Jobs.getFragment('organization')}
      }
    `
  }
});
