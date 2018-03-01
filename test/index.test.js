var slim = require('../src')
var h = slim.h
var app = slim.app

beforeEach(function() {
  document.body.innerHTML = ''
})

test('compile and render with text node', () => {
  var view = function(actions, state) {
    return 'test'
  }
  var actions = {}
  var state = {}
  app(view, actions, state, document.body)

  expect(document.body.innerHTML).toBe('test')
})

test('compile and render', () => {
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

test('update', () => {
  var view = function(actions, state) {
    return h('p', {
      onclick: function() {}
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

test('unkeyed elements', () => {
  var view = function(actions, state) {
    return h('div', {}, state.els.map(el => h(el, {}, ['1'])))
  }
  var actions = {
    test: els => state => { state.els = els }
  }
  var state = {
    els: ['div']
  }
  var vm = app(view, actions, state, document.body)
  expect(document.body.innerHTML).toBe('<div><div>1</div></div>')

  vm.test(['div', 'p'])
  expect(document.body.innerHTML).toBe('<div><div>1</div><p>1</p></div>')

  vm.test(['div', 'span', 'p'])
  expect(document.body.innerHTML).toBe('<div><div>1</div><span>1</span><p>1</p></div>')
})

test('children reorder', () => {
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

test('attrs update', () => {
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

test('life cycle', () => {
  var create = jest.fn()
  var update = jest.fn()
  var remove = jest.fn()
  var destroy = jest.fn()

  var view = function(actions, state) {
    return h('ol', {
      'data-num': state.list.length,
      oncreate: create,
      onupdate: update
    }, state.list.map(item => h('li', {
      key: item.key,
      onremove: remove,
      ondestroy: destroy
    }, [item.text])))
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
  expect(create).toHaveBeenCalledTimes(1)

  vm.add({
    key: 3,
    text: '3'
  })
  expect(update).toHaveBeenCalledTimes(1)

  vm.del(1)
  expect(remove).toHaveBeenCalledTimes(1)
  expect(destroy).toHaveBeenCalledTimes(1)
})
