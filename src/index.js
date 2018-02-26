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
  var wiredActions = wireStateToActions(actions, state)
  var rootNode = view(wiredActions, state)
  var rootEl = render(rootNode)
  container.appendChild(rootEl)

  return wiredActions

  function wireStateToActions(actions, state) {
    var _actions = {}
    var handler
    for (var key in actions) {
      handler = actions[key]
      ;(function(key, handler) {
        _actions[key] = function(payload) {
          handler(payload)(state)

          updateView()
        }
      })(key, handler)
    }

    return _actions
  }

  function updateView() {
    var oldEl = rootEl
    rootNode = view(wiredActions, state)
    rootEl = render(rootNode)

    container.removeChild(oldEl)
    container.appendChild(rootEl)
  }
}

exports.app = app
exports.h = h
