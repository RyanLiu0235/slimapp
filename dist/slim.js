/**
 * slimapp v0.0.1
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

var seb_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){var e=function e(t,n,r){n=n||{}, r=r||[], this.tagName=t, this.props=n, this.key=n.key, this.children=r;for(var i,o=0,a=0;a<r.length;a++)(i=r[a])instanceof e&&(o+=i.count), o++;this.count=o;};var t=function e(t){for(var n,r,i=document.createElement(t.tagName),o=t.props,a=Object.keys(o),s=0;s<a.length;s++)n=a[s], "function"==typeof(r=o[n])?i.addEventListener(n,function(e){r.call(this,e);}):i.setAttribute(n,r);for(var c,f=t.children,u=0;u<f.length;u++)if(c=f[u], ["string","number"].indexOf(typeof c)>-1){var h=document.createTextNode(c);i.appendChild(h);}else{var l=e(c);i.appendChild(l);}return i};function n(e,t){for(var n={},i=[],o=0,a=e.length;o<a;o++){var s=e[o],c=r(s,t);c?n[c]=o:i.push(s);}return{keyIndex:n,free:i}}function r(e,t){if(e&&t)return"string"==typeof t?e[t]:t(e)}var i={makeKeyIndexAndFree:n,diff:function(e,t,i){for(var o,a,s=n(e,i),c=n(t,i),f=c.free,u=s.keyIndex,h=c.keyIndex,l=[],p=[],d=0,v=0;d<e.length;){if(a=r(o=e[d],i))if(h.hasOwnProperty(a)){var y=h[a];p.push(t[y]);}else p.push(null);else{var g=f[v++];p.push(g||null);}d++;}var E=p.slice(0);for(d=0;d<E.length;)null===E[d]?(O(d), P(d)):d++;for(var m=d=0;d<t.length;){a=r(o=t[d],i);var R=E[m],k=r(R,i);R?a===k?m++:u.hasOwnProperty(a)&&r(E[m+1],i)===a?(O(d), P(m), m++):b(d,o):b(d,o), d++;}function O(e){var t={index:e,type:0};l.push(t);}function b(e,t){var n={index:e,item:t,type:1};l.push(n);}function P(e){E.splice(e,1);}return{moves:l,children:p}}}.diff,o={isString:function(e){return"string"==typeof e}},a={REPLACE:"REPLACE",REORDER:"REORDER",PROPS:"PROPS",TEXT:"TEXT"};function s(e,n){var r=n.patch;switch(n.type){case a.REPLACE:var i=o.isString(r)?r:t(r);e.parentNode.replaceChild(i,e);break;case a.REORDER:!function(e,n){for(var r,i,o,a,s=e.childNodes,c=0;c<n.length;c++)switch(r=n[c], i=r.index, o=r.item, a=s[i], r.type){case 0:e.removeChild(a);break;case 1:var f=t(o);e.insertBefore(f,a);}}(e,r.moves);break;case a.PROPS:!function(e,t){for(var n,r,i=Object.keys(t),o=0;o<i.length;o++)n=i[o], "function"==typeof(r=t[n])||(!1===r||void 0===r?e.removeAttribute(n):e.setAttribute(n,r));}(e,r);break;case a.TEXT:var s=document.createTextNode(r);e.parentNode.replaceChild(s,e);}}return{h:function(t,n,r){return new e(t,n,r)},render:t,diff:function(e,t){var n={};return function e(t,n,r,s){var c=[];if(null===n);else if(o.isString(t)&&o.isString(n))t!==n&&c.push({type:a.TEXT,patch:n});else if(t.tagName===n.tagName&&t.key===n.key){for(var f,u=t.props,h=n.props,l=Object.assign({},u,h),p=Object.keys(l),d={},v=0;v<p.length;v++)f=p[v], h[f]!==u[f]&&(d[f]=h[f]);Object.keys(d).length>0&&c.push({type:a.PROPS,patch:d});var y=t.children,g=i(y,n.children,"key"),E=g.moves,m=g.children;E.length>0&&c.push({type:a.REORDER,patch:{moves:E}});for(var R,k,O=null,b=r,P=0;P<y.length;P++)R=y[P], k=m[P], b+=O&&O.count?O.count:1, e(R,k,b,s), O=R;}else c.push({type:a.REPLACE,patch:n});c.length>0&&(s[r]=c);}(e,t,0,n), n},patch:function(e,t){!function e(t,n,r){var i=n[r];if(!o.isString(t))for(var a=t.childNodes,c=0;c<a.length;c++)e(a[c],n,++r);if(i)for(var f=0;f<i.length;f++)s(t,i[f]);}(e,t,0);}}});
});

var h = seb_min.h;
var render = seb_min.render;

/**
 * app
 *
 * @param  {Function} view
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(view, actions, state, container) {
  var _actions = {};
  var handler;
  for (var key in actions) {
    handler = actions[key];
    _actions[key] = function(payload) {
      handler(payload)(state);

      updateView();
    };
  }

  var rootNode = view(_actions, state);
  var rootEl = render(rootNode);
  container.appendChild(rootEl);

  function updateView() {
    var oldEl = rootEl;
    rootNode = view(_actions, state);
    rootEl = render(rootNode);

    container.removeChild(oldEl);
    container.appendChild(rootEl);
  }
  return _actions
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
