const includeBuilder = require('./index')

module.exports = () => (req, res, next) => {
  req.includeBuilder = (aliases, defaultInclude) => includeBuilder(req.query.include, aliases, defaultInclude)

  next()
}
