var seb = require('seb-vdom')
var h = seb.h
var render = seb.render
var diff = seb.diff
var patch = seb.patch

/**
 * app
 *
 * @param  {Function} view
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(view, actions, state, container) {
  var tree = view(actions, state)
  var dom = render(tree)
  container.appendChild(dom)
}

exports.app = app
exports.h = h
