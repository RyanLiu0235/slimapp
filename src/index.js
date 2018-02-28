function getType(test) {
  return typeof test
}

function isString(obj) {
  return getType(obj) === 'string'
}

function isUndefined(test) {
  return test === undefined
}

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

function h(tagName, props, children) {
  return new VNode(tagName, props, children)
}

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
  var rootEl = (container && container.childNodes[0]) || null
  rootEl = diffAndPatch(container, rootEl, null, rootNode)

  return wiredActions

  function render(vnode) {
    if (isString(vnode)) {
      return document.createTextNode(vnode)
    } else {
      // 1. tag
      var el = document.createElement(vnode.tagName)

      // 2. add props
      var props = vnode.props
      var propNames = Object.keys(props)
      var prop, value
      for (var i = 0; i < propNames.length; i++) {
        prop = propNames[i]
        value = props[prop]
        if (prop === 'key') continue
        if (getType(value) === 'function') {
          // bind this function to el
          // prop expects event name lick `onclick`
          if (prop in el) {
            el[prop] = value
          }
        } else {
          el.setAttribute(prop, value)
        }
      }

      // 3. children
      var children = vnode.children
      var child
      for (var j = 0; j < children.length; j++) {
        child = children[j]
        // if child is text
        if (['string', 'number'].indexOf(getType(child)) > -1) {
          var textNode = document.createTextNode(child)
          el.appendChild(textNode)
        } else {
          var childNode = render(child)
          el.appendChild(childNode)
        }
      }

      return el
    }
  }

  function wireStateToActions(actions, state) {
    var _actions = {}
    var handler
    for (var key in actions) {
      handler = actions[key]
      ;(function(key, handler) {
        _actions[key] = function(payload) {
          handler(payload)(state)
          diffAndPatch(container, rootEl, rootNode, rootNode = view(wiredActions, state))
        }
      })(key, handler)
    }

    return _actions
  }

  function diffAndPatch(parent, oldEl, oldNode, newNode) {
    if (oldNode === null) {
      // 1. brand new node
      oldEl = parent.appendChild(render(newNode))
    } else if (
      isString(oldNode) && isString(newNode) &&
      oldNode !== newNode
    ) {
      // 2. both text node and changed
      parent.textContent = newNode
    } else if (
      oldNode.tagName &&
      oldNode.tagName === newNode.tagName &&
      oldNode.key === newNode.key
    ) {
      // 3. tag remains still, we'll check if attrs and children have been changed
      // check attrs
      updateAttrs(oldEl, oldNode.props, newNode.props)

      // check children
      var oldChildren = oldNode.children
      var newChildren = newNode.children

      // store all the old keys
      var oldChildrenMap = []
      var key
      for (var m = 0; m < oldChildren.length; m++) {
        key = oldChildren[m].key
        if (!isUndefined(key)) {
          oldChildrenMap[key] = [oldEl.childNodes[m], oldChildren[m]]
        }
      }

      // go through newChildren
      var i = 0 // cursor for newNode
      var j = 0 // cursor for oldNode
      var oldKeyCache = {}
      var oldChild, newChild, oldKey, newKey

      // go through newChildren
      while (i < newChildren.length) {
        newChild = newChildren[i]
        oldChild = oldChildren[j]

        if (isUndefined(oldChild)) {
          oldEl.insertBefore(render(newChild), null)
          i++
          continue
        }

        newKey = newChild.key
        oldKey = oldChild.key

        if (isUndefined(newKey)) {
          if (isUndefined(oldKey)) {
            diffAndPatch(oldEl, oldEl.childNodes[i], oldChild, newChild)
            j++
          }
          i++
        } else {
          if (oldKeyCache[newKey]) {
            // if this VNode has been stored before, apply it
            oldEl.insertBefore(render(oldKeyCache[newKey]), render(oldChild))
            i++
          } else if (oldKey === newKey) {
            // if VNode has not changed, patch directly
            diffAndPatch(oldEl, oldChildrenMap[oldKey][0], oldChild, newChild)
            i++
            j++
          } else {
            // go through oldChildren till we find the node with same key,
            // if not, create it with newChild and insert
            while (j < oldChildren.length) {
              oldChild = oldChildren[j]
              oldKey = oldChild.key

              if (oldKey === newKey) {
                diffAndPatch(oldEl, oldChildrenMap[oldKey][0], oldChild, newChild)
                i++
                j++
                break
              } else {
                oldKeyCache[oldKey] = oldChild
                oldChildren.splice(j, 1)
                oldEl.removeChild(oldChildrenMap[oldKey][0])
              }
            }
          }
        }
      }
    }

    return oldEl
  }

  function updateAttrs(el, oldProps, newProps) {
    var allProps = Object.assign({}, oldProps, newProps)
    var propsKeys = Object.keys(allProps)

    var key
    var propsPatches = {}
    for (var i = 0; i < propsKeys.length; i++) {
      key = propsKeys[i]
      if (key === 'key') continue
      if (newProps[key] !== oldProps[key]) {
        propsPatches[key] = newProps[key]
      }
    }

    var props = Object.keys(propsPatches)
    if (props.length > 0) {
      var prop, value
      for (var j = 0; j < props.length; j++) {
        prop = props[j]
        value = propsPatches[prop]
        if (getType(value) === 'function') {
          el[prop] = value
        } else if (value === false || isUndefined(value)) {
          el.removeAttribute(prop)
        } else {
          el.setAttribute(prop, value)
        }
      }
    }
  }
}

exports.app = app
exports.h = h
