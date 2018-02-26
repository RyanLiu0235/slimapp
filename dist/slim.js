/**
 * slimapp v0.1.0
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.slim = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var seb = createCommonjsModule(function (module, exports) {
/**
 * seb-vdom v0.1.0
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
(function (global, factory) {
	module.exports = factory();
}(commonjsGlobal, (function () { function VNode(tagName, props, children) {
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

function render(vnode) {
  // 1. tag
  var el = document.createElement(vnode.tagName);

  // 2. add props
  var props = vnode.props;
  var propNames = Object.keys(props);
  var prop, value;
  for (var i = 0; i < propNames.length; i++) {
    prop = propNames[i];
    value = props[prop];
    if (typeof value === 'function') {
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
    if (['string', 'number'].indexOf(typeof child) > -1) {
      var textNode = document.createTextNode(child);
      el.appendChild(textNode);
    } else {
      var childNode = render(child);
      el.appendChild(childNode);
    }
  }

  return el
}

var render_1 = render;

/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function diff (oldList, newList, key) {
  var oldMap = makeKeyIndexAndFree(oldList, key);
  var newMap = makeKeyIndexAndFree(newList, key);

  var newFree = newMap.free;

  var oldKeyIndex = oldMap.keyIndex;
  var newKeyIndex = newMap.keyIndex;

  var moves = [];

  // a simulate list to manipulate
  var children = [];
  var i = 0;
  var item;
  var itemKey;
  var freeIndex = 0;

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i];
    itemKey = getItemKey(item, key);
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null);
      } else {
        var newItemIndex = newKeyIndex[itemKey];
        children.push(newList[newItemIndex]);
      }
    } else {
      var freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }
    i++;
  }

  var simulateList = children.slice(0);

  // remove items no longer exist
  i = 0;
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i);
      removeSimulate(i);
    } else {
      i++;
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0;
  while (i < newList.length) {
    item = newList[i];
    itemKey = getItemKey(item, key);

    var simulateItem = simulateList[j];
    var simulateItemKey = getItemKey(simulateItem, key);

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++;
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item);
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key);
          if (nextItemKey === itemKey) {
            remove(i);
            removeSimulate(j);
            j++; // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item);
          }
        }
      }
    } else {
      insert(i, item);
    }

    i++;
  }

  function remove (index) {
    var move = {index: index, type: 0};
    moves.push(move);
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1};
    moves.push(move);
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1);
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {};
  var free = [];
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    var itemKey = getItemKey(item, key);
    if (itemKey) {
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

var makeKeyIndexAndFree_1 = makeKeyIndexAndFree; // exports for test
var diff_2 = diff;

var diff_1 = {
	makeKeyIndexAndFree: makeKeyIndexAndFree_1,
	diff: diff_2
};

var listDiff2 = diff_1.diff;

var isString = function(obj) {
  return typeof obj === 'string'
};

var utils = {
	isString: isString
};

var REPLACE = 'REPLACE';
var REORDER = 'REORDER';
var PROPS = 'PROPS';
var TEXT = 'TEXT';

var types = {
	REPLACE: REPLACE,
	REORDER: REORDER,
	PROPS: PROPS,
	TEXT: TEXT
};

function diff$1(oldTree, newTree) {
  var index = 0;
  var patches = {};
  walk(oldTree, newTree, index, patches);
  return patches
}

function walk(oldNode, newNode, index, patches) {
  var _patches = [];

  if (newNode === null) {
    // 1. node has been removed
  } else if (utils.isString(oldNode) && utils.isString(newNode)) {
    // 2. both textNode and changed
    if (oldNode !== newNode) {
      _patches.push({
        type: types.TEXT,
        patch: newNode
      });
    }
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    // element remain still, we'll check props and children
    // 3. props have been changed
    var oldProps = oldNode.props;
    var newProps = newNode.props;
    var allProps = Object.assign({}, oldProps, newProps);
    var propsKeys = Object.keys(allProps);

    var key;
    var propsPatches = {};
    for (var i = 0; i < propsKeys.length; i++) {
      key = propsKeys[i];
      if (newProps[key] !== oldProps[key]) {
        propsPatches[key] = newProps[key];
      }
    }

    if (Object.keys(propsPatches).length > 0) {
      _patches.push({
        type: types.PROPS,
        patch: propsPatches
      });
    }

    // 4. walk all the children
    var oldChildren = oldNode.children;
    var childrenPatches = listDiff2(oldChildren, newNode.children, 'key');
    var moves = childrenPatches.moves;
    var newChildren = childrenPatches.children;
    if (moves.length > 0) {
      _patches.push({
        type: types.REORDER,
        patch: {
          moves: moves
        }
      });
    }

    var leftNode = null;
    var _index = index;
    var oldChild, newChild;
    for (var j = 0; j < oldChildren.length; j++) {
      oldChild = oldChildren[j];
      newChild = newChildren[j];

      _index += leftNode && leftNode.count ? leftNode.count : 0 + 1;

      walk(oldChild, newChild, _index, patches);
      leftNode = oldChild;
    }
  } else {
    // 5. element has been totally replaced
    _patches.push({
      type: types.REPLACE,
      patch: newNode
    });
  }

  if (_patches.length > 0) {
    patches[index] = _patches;
  }
}

var diff_1$2 = diff$1;

function patch(oldDom, patches) {
  var count = 0;
  walk$1(oldDom, patches, count);
}

function walk$1(oldDom, patches, count) {
  var currentPatch = patches[count];

  if (!utils.isString(oldDom)) {
    var children = oldDom.childNodes;
    for (var j = 0; j < children.length; j++) {
      walk$1(children[j], patches, ++count);
    }
  }
  if (currentPatch) {
    for (var i = 0; i < currentPatch.length; i++) {
      handlePatch(oldDom, currentPatch[i]);
    }
  }
}

function handlePatch(oldDom, currentPatch) {
  var _patch = currentPatch.patch;

  switch (currentPatch.type) {
    case types.REPLACE:
      var newDom = utils.isString(_patch) ? _patch : render_1(_patch);
      oldDom.parentNode.replaceChild(newDom, oldDom);
      break
    case types.REORDER:
      patchReorder(oldDom, _patch.moves);
      break
    case types.PROPS:
      patchProps(oldDom, _patch);
      break
    case types.TEXT:
      var newText = document.createTextNode(_patch);
      oldDom.parentNode.replaceChild(newText, oldDom);
      break
  }
}

function patchReorder(oldDom, moves) {
  var children = oldDom.childNodes;
  var move, index, item, child;
  for (var i = 0; i < moves.length; i++) {
    move = moves[i];
    index = move.index;
    item = move.item;
    child = children[index];

    switch (move.type) {
      case 0:
        // remove
        oldDom.removeChild(child);
        break
      case 1:
        // insert
        var newDom = render_1(item);
        oldDom.insertBefore(newDom, child);
        break
    }
  }
}

function patchProps(oldDom, _patch) {
  var props = Object.keys(_patch);
  var prop, value;
  for (var i = 0; i < props.length; i++) {
    prop = props[i];
    value = _patch[prop];
    if (typeof value === 'function') {
      // can't bind function later
    } else if (value === false || value === undefined) {
      oldDom.removeAttribute(prop);
    } else {
      oldDom.setAttribute(prop, value);
    }
  }
}

var patch_1 = patch;

var h$1 = h_1;
var render$2 = render_1;
var diff$2 = diff_1$2;
var patch$1 = patch_1;

var src = {
	h: h$1,
	render: render$2,
	diff: diff$2,
	patch: patch$1
};

var vdom = src;

return vdom;

})));
});

var h = seb.h;
var render = seb.render;

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
  var rootNode = view(wiredActions, state);
  var rootEl = render(rootNode);
  container.appendChild(rootEl);

  return wiredActions

  function wireStateToActions(actions, state) {
    var _actions = {};
    var handler;
    for (var key in actions) {
      handler = actions[key]
      ;(function(key, handler) {
        _actions[key] = function(payload) {
          handler(payload)(state);

          updateView();
        };
      })(key, handler);
    }

    return _actions
  }

  function updateView() {
    var oldEl = rootEl;
    rootNode = view(wiredActions, state);
    rootEl = render(rootNode);

    container.removeChild(oldEl);
    container.appendChild(rootEl);
  }
}

var app_1 = app;
var h_1 = h;

var src = {
	app: app_1,
	h: h_1
};

var slimapp = src;

return slimapp;

})));
