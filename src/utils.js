exports.getType = function(test) {
  return typeof test
}

exports.isString = function(test) {
  return exports.getType(test) === 'string'
}

exports.isUndefined = function(test) {
  return test === undefined
}
