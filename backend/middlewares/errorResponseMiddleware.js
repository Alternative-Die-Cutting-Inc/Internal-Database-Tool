function errorResponseMiddleware(error, req, res, next) {
  let statusCode, errorMessage;
  console.log(`\n\nError Middleware`);
  console.log(`\n\n`);
  console.error(error);

  switch (error.message) {
    case 'DUPLICATE_USERNAME':
      statusCode = 400;
      errorMessage = 'This username has already been used to create an account.';
      break;
    case 'INVALID_EMAIL':
      statusCode = 400;
      errorMessage = 'Please submit a valid email address.';
      break;
    case 'INVALID_PASSWORD':
      statusCode = 400;
      errorMessage = 'Please submit a valid password.';
      break;
    case 'UNABLE_TO_UPDATE_USER':
      statusCode = 400;
      errorMessage = 'Error in updating user.';
      break;
    case 'UNAUTHORIZED':
      statusCode = 403;
      errorMessage = 'Unauthorized';
      break;
    case 'QUOTE_NOT_FOUND':
      statusCode = 404;
      errorMessage = 'This quote does not exist. Please recheck the quote number.';
      break;
    case 'UNABLE_TO_GET_QUOTE':
      statusCode = 400;
      errorMessage =
        'There was an error while trying to retrieve the quote. Please try again and check the quote number.';
      break;
    case 'INVALID_CREDENTIALS':
      statusCode = 401;
      errorMessage = 'Invalid credentials. Please ensure your username and password are correct.';
      break;
    case 'UNABLE_TO_CREATE_USER':
      statusCode = 400;
      errorMessage = 'There was an error while trying to create the user.';
      break;
    case 'UNABLE_TO_PROCESS_PASSWORD':
      statusCode = 400;
      errorMessage = 'There was an error while trying to process the password. Please try again.';
      break;
    case 'UNABLE_TO_AUTHENTICATE_USER':
      statusCode = 400;
      errorMessage = 'There was an error while trying to authenticate the user. Please try again.';
    default:
      statusCode = 500;
      errorMessage =
        'An unexpected error occurred. Please try again. If the problem persists, please contact dev.';
      break;
  }

  res.status(statusCode).send({ errorMessage, code: error?.message });
}

module.exports = errorResponseMiddleware;
