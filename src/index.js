var seb = require('seb-vdom')
var h = seb.h
var render = seb.render

/**
 * app
 *
 * @param  {Function} view
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(view, actions, state, container) {
  var _actions = {}
  var handler
  for (var key in actions) {
    handler = actions[key]
    _actions[key] = function(payload) {
      handler(payload)(state)

      updateView()
    }
  }

  var rootNode = view(_actions, state)
  var rootEl = render(rootNode)
  container.appendChild(rootEl)

  function updateView() {
    var oldEl = rootEl
    rootNode = view(_actions, state)
    rootEl = render(rootNode)

    container.removeChild(oldEl)
    container.appendChild(rootEl)
  }
  return _actions
}

exports.app = app
exports.h = h
