var slim = require('../src')
var h = slim.h
var app = slim.app

beforeEach(function() {
  document.body.innerHTML = ''
})

test('compile', function() {
  var view = function(actions, state) {
    return h('p', {}, [state.a])
  }
  var actions = {}
  var state = {
    a: 1
  }
  app(view, actions, state, document.body)

  expect(document.body.innerHTML).toBe('<p>1</p>')
})
