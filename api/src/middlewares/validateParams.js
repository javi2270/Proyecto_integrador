module.exports = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });

  if (error) {
    return next({
      status: 400,
      message: error.details.map(err => err.message).join(", ")
    });
  }

  next();
};
