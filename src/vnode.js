/**
 * VNode constructor
 *
 * @param {String} tagName
 * @param {Object} props
 * @param {Array} children
 */
function VNode(tagName, props, children) {
  props = props || {}
  children = children || []
  this.tagName = tagName
  this.props = props
  this.key = props.key
  this.children = children

  var count = 0
  var child
  for (var i = 0; i < children.length; i++) {
    child = children[i]
    if (child instanceof VNode) {
      count += child.count
    } else {
      children[i] = '' + child
    }
    count++
  }
  this.count = count
}

module.exports = VNode