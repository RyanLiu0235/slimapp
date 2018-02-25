var seb = require('seb-vdom')
var h = seb.h
var render = seb.render
var diff = seb.diff
var patch = seb.patch

/**
 * app
 *
 * @param  {VNode} 	tree
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(tree, actions, state, container) {
  var dom = render(tree)
  container.appendChild(dom)
}

exports.app = app
exports.h = h
