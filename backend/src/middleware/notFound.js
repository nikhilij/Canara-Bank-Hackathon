// Middleware to handle 404 Not Found errors
module.exports = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};
