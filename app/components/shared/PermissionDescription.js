import React from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';

export default class PermissionDescription extends React.PureComponent {
  static propTypes = {
    allowed: PropTypes.bool.isRequired,
    permission: PropTypes.string.isRequired
  };

  render() {
    const { allowed, permission } = this.props;

    const icon = allowed ? 'permission-small-tick' : 'permission-small-cross';
    const words = allowed ? `Can ${permission}.` : `Can not ${permission}.`;

    return (
      <div className="flex mt1" style={{ lineHeight: 1.4 }}>
        <Icon icon={icon} className="dark-gray flex-none mr1" style={{ marginTop: -3 }} />
        {words}
      </div>
    );
  }
}