// @flow

import * as React from 'react';
import {createFragmentContainer, graphql} from 'react-relay/compat';
import classNames from 'classnames';
import Button from 'app/components/shared/Button';
import Spinner from 'app/components/shared/Spinner';
import type {ShowMoreFooter_connection} from './__generated__/ShowMoreFooter_connection.graphql';

type Props = {
  connection: ShowMoreFooter_connection,
  onShowMore: () => void,
  label: string,
  loading: boolean,
  searching: boolean,
  className?: string
};

export class ShowMoreFooter extends React.PureComponent<Props> {
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

export default createFragmentContainer(ShowMoreFooter, graphql`
  fragment ShowMoreFooter_connection on PipelineConnection {
    pageInfo {
      hasNextPage
    }
  }
`);