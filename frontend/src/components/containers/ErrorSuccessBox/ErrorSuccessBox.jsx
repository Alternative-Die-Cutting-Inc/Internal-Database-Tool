/**
 * @fileOverview ErrorSuccessBox component.
 * @author Farbod Mohammadzadeh - https://github.com/Freeassassin
 * @version 1.0
 * @date 2023-06-07
 * @description This component is used to show error or success messages to user. This component is used in all pages.
 * @resource 
 */

import PropTypes from 'prop-types';
import './ErrorSuccessBox.scss';

const ErrorSuccessBox = ({ content, success, error, style }) => {
  if (content === '' || content === undefined) {
    return <></>;
  }
  return (
    <div
      style={style}
      className={`error-success-box-container ${success ? 'error-success-box-success' : ''} ${
        error ? 'error-success-box-error' : ''
      }`}
    >
      {content}
    </div>
  );
};

ErrorSuccessBox.propTypes = {
  content: PropTypes.string.isRequired,
  success: PropTypes.bool,
  error: PropTypes.bool,
  style: PropTypes.object,
};

export { ErrorSuccessBox };
