function errorResponseMiddleware(err, req, res, next) {
  let statusCode, errorMessage;
  console.log('errorMiddleware');
  console.log(err);

  if (err.message === 'DUPLICATE_EMAIL') {
    statusCode = 400;
    errorMessage = 'This email address has already been used to create an account.';
  } else if (err.errors) {
    console.log(err);
    statusCode = 400;
    errorMessage = 'Please provide your full name.';
  } else if (err.message === 'INVALID_EMAIL') {
    statusCode = 400;
    errorMessage = 'Please submit a valid email address.';
  } else if (err.message === 'INVALID_PASSWORD') {
    statusCode = 400;
    errorMessage = 'Please submit a valid password.';
  } else if (err.message === 'UNABLE_TO_UPDATE_USER') {
    statusCode = 400;
    errorMessage = 'Error in updating user.';
  } else if (err.message === 'UNAUTHORIZED') {
    statusCode = 403;
    errorMessage = 'Unauthorized';
  } else if (err.message === 'QUOTE_NOT_FOUND') {
    statusCode = 404;
    errorMessage = 'This quote does not exist. Please recheck the quote number.';
  } else if (err.message === 'UNABLE_TO_GET_QUOTE') {
    statusCode = 400;
    errorMessage =
      'There was an error while trying to retrieve the quote. Please try again and check the quote number.';
  } else {
    statusCode = 500;
    errorMessage = 'whoops we have no idea what happened!?';
  }
  //... for more error messages ...

  res.status(statusCode).send({ errorMessage, code: err?.message });
}

module.exports = errorResponseMiddleware;
