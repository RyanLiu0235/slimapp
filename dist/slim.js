/**
 * slimapp v0.1.2
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.slim = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var utils = createCommonjsModule(function (module, exports) {
exports.getType = function(test) {
  return typeof test
};

exports.isString = function(test) {
  return exports.getType(test) === 'string'
};

exports.isUndefined = function(test) {
  return test === undefined
};
});

var utils_1 = utils.getType;
var utils_2 = utils.isString;
var utils_3 = utils.isUndefined;

/**
 * VNode constructor
 *
 * @param {String} tagName
 * @param {Object} props
 * @param {Array} children
 */
function VNode(tagName, props, children) {
  props = props || {};
  children = children || [];
  this.tagName = tagName;
  this.props = props;
  this.key = props.key;
  this.children = children;

  var count = 0;
  var child;
  for (var i = 0; i < children.length; i++) {
    child = children[i];
    if (child instanceof VNode) {
      count += child.count;
    } else {
      children[i] = '' + child;
    }
    count++;
  }
  this.count = count;
}

var vnode = VNode;

function h(tagName, props, children) {
  return new vnode(tagName, props, children)
}

var h_1 = h;

/**
 * app
 *
 * @param  {Function} view
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(view, actions, state, container) {
  var wiredActions = wireStateToActions(actions, state);
  var rootNode = null;
  var rootEl = (container && container.childNodes[0]) || null;

  // after we have updated all the DOM according to the diff results
  // pop all the hooks and invoke them
  var isFisrtRender = true;
  var lifeCycleStack = [];
  render();

  return wiredActions

  function render() {
    rootEl = diffAndPatch(container, rootEl, rootNode, rootNode = view(wiredActions, state));
    isFisrtRender = false;

    var _hook;
    while (_hook = lifeCycleStack.pop()) {
      _hook();
    }
  }

  function createElement(vnode) {
    if (utils.isString(vnode)) {
      return document.createTextNode(vnode)
    } else {
      // 1. tag
      var el = document.createElement(vnode.tagName);

      // 2. add props
      var props = vnode.props;
      var propNames = Object.keys(props);
      var prop, value;
      for (var i = 0; i < propNames.length; i++) {
        prop = propNames[i];
        value = props[prop];
        if (prop === 'key') continue
        if (prop === 'oncreate') {
          lifeCycleStack.push((function(handler) {
            handler(el);
          })(value));
        } else if (utils.getType(value) === 'function') {
          // bind this function to el
          // prop expects event name lick `onclick`
          if (prop in el) {
            el[prop] = value;
          }
        } else {
          el.setAttribute(prop, value);
        }
      }

      // 3. children
      var children = vnode.children;
      var child;
      for (var j = 0; j < children.length; j++) {
        child = children[j];
        // if child is text
        if (['string', 'number'].indexOf(utils.getType(child)) > -1) {
          var textNode = document.createTextNode(child);
          el.appendChild(textNode);
        } else {
          var childNode = createElement(child);
          el.appendChild(childNode);
        }
      }

      return el
    }
  }

  function removeElement(parent, childDom, childVNode) {
    var onremove = childVNode.props.onremove;
    var ondestroy = childVNode.props.ondestroy;
    if (utils.getType(onremove) === 'function') {
      onremove(childDom);
    }
    parent.removeChild(childDom);
    if (utils.getType(ondestroy) === 'function') {
      ondestroy(childDom);
    }
  }

  function wireStateToActions(actions, state) {
    var _actions = {};
    var handler;
    for (var key in actions) {
      handler = actions[key];
      (function(key, handler) {
        _actions[key] = function(payload) {
          handler(payload)(state);
          render();
        };
      })(key, handler);
    }

    return _actions
  }

  function diffAndPatch(parent, oldEl, oldNode, newNode) {
    if (oldNode === null) {
      // 1. brand new node
      oldEl = parent.insertBefore(createElement(newNode), oldEl);
    } else if (utils.isString(oldNode) && utils.isString(newNode)) {
      // 2. both text node and changed
      if (oldNode !== newNode) {
        parent.textContent = newNode;
      }
    } else if (
      oldNode.tagName &&
      oldNode.tagName === newNode.tagName
    ) {
      // 3. tag remains still, we'll check if attrs and children have been changed
      // 3.1. check attrs
      updateAttrs(oldEl, oldNode.props, newNode.props);

      // 3.2. check children
      var oldChildren = oldNode.children;
      var newChildren = newNode.children;

      var oldElements = [];
      var oldKeyMap = {};
      var newKeyed = [];
      for (var m = 0; m < oldChildren.length; m++) {
        oldElements.push(oldEl.childNodes[m]);
        var key = oldChildren[m].key;
        if (!utils.isUndefined(key)) {
          oldKeyMap[key] = [oldChildren[m], oldEl.childNodes[m]];
        }
      }

      var i = 0; // i is the cursor when iterate newChildren
      var j = 0; // j is the cursor when iterate oldChildren
      while (i < newChildren.length) {
        var oldChild = oldChildren[j];
        var newChild = newChildren[i];

        if (utils.isUndefined(oldChild)) {
          diffAndPatch(oldEl, null, null, newChild);
          i++;
          continue
        }

        var oldKey = oldChild.key;
        var newKey = newChild.key;

        if (utils.isUndefined(oldKey)) {
          if (utils.isUndefined(newKey)) {
            diffAndPatch(oldEl, oldEl.childNodes[j], oldChild, newChild);
            i++;
          }
          j++;
        } else {
          if (oldKey === newKey) {
            diffAndPatch(oldEl, oldEl.childNodes[j], oldChild, newChild);
            j++;
          } else if (oldKeyMap[newKey]) {
            diffAndPatch(oldEl, oldEl.insertBefore(oldKeyMap[newKey][1], oldElements[j]), oldKeyMap[newKey][0], newChild);
          } else {
            diffAndPatch(oldEl, oldElements[j], null, newChild);
          }
          i++;
          newKeyed.push(newKey);
        }
      }

      while (j < oldChildren.length) {
        if (utils.isUndefined(oldChildren[j].key)) {
          removeElement(oldEl, oldElements[j], oldChildren[j]);
        }
        j++;
      }

      // remove all the old child els that have not been reused
      for (var key in oldKeyMap) {
        if (newKeyed.indexOf(+key) === -1) {
          var child = oldKeyMap[key];
          removeElement(oldEl, child[1], child[0]);
        }
      }
    } else {
      // 3. remove old el, create new one
      var newEl = createElement(newNode);
      parent.insertBefore(newEl, oldEl);
      parent.removeChild(oldEl);
      oldEl = newEl;
    }

    return oldEl
  }

  function updateAttrs(el, oldProps, newProps) {
    var allProps = Object.assign({}, oldProps, newProps);
    var propsKeys = Object.keys(allProps);

    var key;
    var propsPatches = {};
    for (var i = 0; i < propsKeys.length; i++) {
      key = propsKeys[i];
      if (key === 'key') continue
      if (newProps[key] !== oldProps[key]) {
        propsPatches[key] = newProps[key];
      }
    }

    var props = Object.keys(propsPatches);
    if (props.length > 0) {
      var prop, value;
      for (var j = 0; j < props.length; j++) {
        prop = props[j];
        value = propsPatches[prop];
        if (utils.getType(value) === 'function') {
          el[prop] = value;
        } else if (value === false || utils.isUndefined(value)) {
          el.removeAttribute(prop);
        } else {
          el.setAttribute(prop, value);
        }
      }
    }

    var cb = isFisrtRender ? newProps.oncreate : newProps.onupdate;
    if (cb) {
      lifeCycleStack.push(function() {
        cb(el, oldProps);
      });
    }
  }
}

var app_1 = app;
var h_1$2 = h_1;

var src = {
	app: app_1,
	h: h_1$2
};

var slimapp = src;

return slimapp;

})));
