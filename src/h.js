var VNode = require('./vnode')

function h(tagName, props, children) {
  return new VNode(tagName, props, children)
}

module.exports = h
