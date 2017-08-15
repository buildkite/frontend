import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FormInputHelp = ({ className, children, ...props }) => (
  <p
    className={classNames('mt1 mb0 p0 dark-gray', className)}
    {...props}
  >
    {children}
  </p>
);

FormInputHelp.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default FormInputHelp;
