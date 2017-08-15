import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const FormInputErrors = ({ className, errors, ...props }) => {
  if (errors.length < 1) {
    return null;
  }

  return (
    <p className={classNames('mt1 mb2 p0 red', className)} {...props}>
      {errors.reduce(
        (acc, item, index, arr) => {
          const separator = (
            index > 0
              ? [', ']
              : []
          );

          return acc.concat(separator).concat([item]);
        },
        []
      )}
    </p>
  );
};

FormInputErrors.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.node.isRequired)
};

FormInputErrors.defaultProps = {
  errors: []
};

export default FormInputErrors;
