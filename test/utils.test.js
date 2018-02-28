var _ = require('../src/utils')

test('getType', () => {
  var getType = _.getType

  expect(getType('test')).toBe('string')
  expect(getType(1)).toBe('number')
  expect(getType({})).toBe('object')
})

test('isString', () => {
  expect(_.isString('')).toBeTruthy()
  expect(_.isString(1)).toBeFalsy()
})

test('isUndefined', () => {
  expect(_.isUndefined(undefined)).toBeTruthy()
  expect(_.isUndefined(1)).toBeFalsy()
})
