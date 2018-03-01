var _ = require('./utils')
var h = require('./h')

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
  var rootNode = null
  var rootEl = (container && container.childNodes[0]) || null

  // after we have updated all the DOM according to the diff results
  // pop all the hooks and invoke them
  var isFisrtRender = true
  var lifeCycleStack = []
  render()

  return wiredActions

  function render() {
    rootEl = diffAndPatch(container, rootEl, rootNode, rootNode = view(wiredActions, state))
    isFisrtRender = false

    var _hook
    while (_hook = lifeCycleStack.pop()) {
      _hook()
    }
  }

  function createElement(vnode) {
    if (_.isString(vnode)) {
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
        if (prop === 'oncreate') {
          lifeCycleStack.push((function(handler) {
            handler(el)
          })(value))
        } else if (_.getType(value) === 'function') {
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
        if (['string', 'number'].indexOf(_.getType(child)) > -1) {
          var textNode = document.createTextNode(child)
          el.appendChild(textNode)
        } else {
          var childNode = createElement(child)
          el.appendChild(childNode)
        }
      }

      return el
    }
  }

  function removeElement(parent, childDom, childVNode) {
    var onremove = childVNode.props.onremove
    var ondestroy = childVNode.props.ondestroy
    if (_.getType(onremove) === 'function') {
      onremove(childDom)
    }
    parent.removeChild(childDom)
    if (_.getType(ondestroy) === 'function') {
      ondestroy(childDom)
    }
  }

  function wireStateToActions(actions, state) {
    var _actions = {}
    var handler
    for (var key in actions) {
      handler = actions[key];
      (function(key, handler) {
        _actions[key] = function(payload) {
          handler(payload)(state)
          render()
        }
      })(key, handler)
    }

    return _actions
  }

  function diffAndPatch(parent, oldEl, oldNode, newNode) {
    if (oldNode === null) {
      // 1. brand new node
      oldEl = parent.appendChild(createElement(newNode))
    } else if (
      _.isString(oldNode) && _.isString(newNode) &&
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
        if (!_.isUndefined(key)) {
          oldChildrenMap[key] = [oldEl.childNodes[m], oldChildren[m]]
        }
      }

      // go through newChildren
      var i = 0 // cursor for newNode
      var j = 0 // cursor for oldNode
      var oldKeyCache = []
      var oldChild, newChild, oldKey, newKey
      while (i < newChildren.length) {
        newChild = newChildren[i]
        oldChild = oldChildren[j]

        if (_.isUndefined(oldChild)) {
          oldEl.insertBefore(createElement(newChild), null)
          i++
          continue
        }

        newKey = newChild.key
        oldKey = oldChild.key

        if (_.isUndefined(newKey)) {
          if (_.isUndefined(oldKey)) {
            diffAndPatch(oldEl, oldEl.childNodes[i], oldChild, newChild)
            j++
          }
          i++
        } else {
          var index = oldKeyCache.indexOf(newKey)
          if (index > -1) {
            // if this VNode has been stored before, apply it
            oldEl.insertBefore(createElement(oldChildrenMap[newKey][0]), createElement(oldChild))
            oldKeyCache.splice(index, 1)
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
                oldKeyCache.push(oldKey)
                oldChildren.splice(j, 1)
              }
            }
          }
        }
      }

      // remove all the els that have not been reused
      var m = 0
      while (m < oldKeyCache.length) {
        var child = oldChildrenMap[oldKeyCache[m]]
        removeElement(oldEl, child[0], child[1])
        m++
      }
    } else {
      // 3. remove old el, create new one
      var newEl = createElement(newNode)
      parent.insertBefore(newEl, oldEl)
      parent.removeChild(oldEl)
      oldEl = newEl
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
        if (_.getType(value) === 'function') {
          el[prop] = value
        } else if (value === false || _.isUndefined(value)) {
          el.removeAttribute(prop)
        } else {
          el.setAttribute(prop, value)
        }
      }
    }

    var cb = isFisrtRender ? newProps.oncreate : newProps.onupdate
    if (cb) {
      lifeCycleStack.push(function() {
        cb(el, oldProps)
      })
    }
  }
}

exports.app = app
exports.h = h
