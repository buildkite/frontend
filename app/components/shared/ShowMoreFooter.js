import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/compat';
import classNames from 'classnames';

import Button from './Button';
import Spinner from './Spinner';

export class ShowMoreFooter extends React.PureComponent {
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
    className: PropTypes.string
  };

  static defaultProps = {
    loading: false,
    searching: false,
    className: 'px3 py2'
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

    return (
      <div className={classNames('center', this.props.className)}>
        {footerContent}
      </div>
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
