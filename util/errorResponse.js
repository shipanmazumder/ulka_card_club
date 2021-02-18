exports.getError = (error, req, res, next) => {
  let message = "Internal Server Error";
  if (error.status === 404) {
    message = "Not found";
  }
  var data = {
    status: false,
    code: error.status,
    message: message,
    data: null,
  };
  res.status(error.status).json(data);
};
exports.validationError = (res, errors) => {
  res.status(422).json({ errors: errors.mapped() });
};
