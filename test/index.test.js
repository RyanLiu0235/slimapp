var slim = require('../src')
var h = slim.h
var app = slim.app

beforeEach(function() {
  document.body.innerHTML = ''
})

test('compile and render with text node', function() {
  var view = function(actions, state) {
    return 'test'
  }
  var actions = {}
  var state = {}
  app(view, actions, state, document.body)

  expect(document.body.innerHTML).toBe('test')
})

test('compile and render', function() {
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

test('update', function() {
  var view = function(actions, state) {
    return h('p', {
      onclick: function() {
        console.log('clicked!')
      }
    }, [state.a])
  }
  var actions = {
    add: function() {
      return function(state) {
        state.a += 1
      }
    }
  }
  var state = {
    a: 1
  }
  var vm = app(view, actions, state, document.body)
  vm.add()

  expect(document.body.innerHTML).toBe('<p>2</p>')
})

test('children reorder', function() {
  var view = function(actions, state) {
    return h('ol', {}, state.list.map(item => h('li', { key: item.key }, [item.text])))
  }
  var actions = {
    add: function(payload) {
      return function(state) {
        state.list.push(payload)
      }
    },
    del: function(key) {
      return function(state) {
        var index = state.list.findIndex(item => item.key === key)
        state.list.splice(index, 1)
      }
    }
  }
  var state = {
    list: [{
      key: 1,
      text: '1'
    }, {
      key: 2,
      text: '2'
    }]
  }
  var vm = app(view, actions, state, document.body)
  vm.add({
    key: 3,
    text: '3'
  })
  vm.del(2)

  expect(document.body.innerHTML).toBe(
    '<ol>' +
    '<li>1</li>' +
    '<li>3</li>' +
    '</ol>'
  )
})

test('attrs update', function() {
  var view = function(actions, state) {
    return h('p', {
      name: state.name,
      class: state.className
    }, 'test')
  }
  var actions = {
    rename: function(name) {
      return function(state) {
        state.name = name
      }
    },
    reclass: function(classes) {
      return function(state) {
        state.className = classes
      }
    }
  }
  var state = {
    name: 'test',
    className: 'classes'
  }
  var vm = app(view, actions, state, document.body)
  vm.rename('test-again')
  vm.reclass()

  expect(document.body.innerHTML).toBe('<p name="test-again">test</p>')
})
