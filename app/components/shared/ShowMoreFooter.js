import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';

import Button from './Button';
import Panel from './Panel';
import Spinner from './Spinner';

class ShowMoreFooter extends React.PureComponent {
  static propTypes = {
    connection: PropTypes.shape({
      pageInfo: PropTypes.shape({
        hasNextPage: PropTypes.bool.isRequired
      }).isRequired
    }),
    onShowMore: PropTypes.func.isRequired,
    label: PropTypes.string,
    loading: PropTypes.bool,
    searching: PropTypes.bool,
    wrappingElement: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string
    ]).isRequired
  };

  static defaultProps = {
    loading: false,
    searching: false,
    wrappingElement: Panel.Footer
  };

  render() {
    const { connection, loading, searching } = this.props;

    // don't show any footer if we're searching
    if (searching) {
      return null;
    }

    // don't show any footer if we haven't ever loaded
    // any items, or if there's no next page
    if (!connection || !connection.pageInfo.hasNextPage) {
      return null;
    }

    let footerContent = (
      <Button
        outline={true}
        theme="default"
        onClick={this.props.onShowMore}
      >
        Show more{this.props.label ? ` ${this.props.label}` : ''}…
      </Button>
    );

    // show a spinner if we're loading more
    if (loading) {
      footerContent = <Spinner style={{ margin: 9.5 }} />;
    }

    const Wrapper = this.props.wrappingElement;

    return (
      <Wrapper className="center">
        {footerContent}
      </Wrapper>
    );
  }
}

export default Relay.createContainer(ShowMoreFooter, {
  fragments: {
    connection: () => Relay.QL`
      fragment on Connection {
        pageInfo {
          hasNextPage
        }
      }
    `
  }
});
