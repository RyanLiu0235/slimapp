/**
 * slimapp v0.0.1
 * (c) 2018 Ryan Liu
 * @license WTFPL
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.slim = {})));
}(this, (function (exports) { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var seb_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function(){var e=function e(t,n,r){n=n||{}, r=r||[], this.tagName=t, this.props=n, this.key=n.key, this.children=r;for(var i,o=0,a=0;a<r.length;a++)(i=r[a])instanceof e&&(o+=i.count), o++;this.count=o;};var t=function e(t){for(var n,r=document.createElement(t.tagName),i=t.props,o=Object.keys(i),a=0;a<o.length;a++)n=o[a], r.setAttribute(n,i[n]);for(var s,c=t.children,f=0;f<c.length;f++)if(s=c[f], ["string","number"].indexOf(typeof s)>-1){var u=document.createTextNode(s);r.appendChild(u);}else{var h=e(s);r.appendChild(h);}return r};function n(e,t){for(var n={},i=[],o=0,a=e.length;o<a;o++){var s=e[o],c=r(s,t);c?n[c]=o:i.push(s);}return{keyIndex:n,free:i}}function r(e,t){if(e&&t)return"string"==typeof t?e[t]:t(e)}var i={makeKeyIndexAndFree:n,diff:function(e,t,i){for(var o,a,s=n(e,i),c=n(t,i),f=c.free,u=s.keyIndex,h=c.keyIndex,l=[],p=[],d=0,v=0;d<e.length;){if(a=r(o=e[d],i))if(h.hasOwnProperty(a)){var g=h[a];p.push(t[g]);}else p.push(null);else{var y=f[v++];p.push(y||null);}d++;}var m=p.slice(0);for(d=0;d<m.length;)null===m[d]?(O(d), P(d)):d++;for(var E=d=0;d<t.length;){a=r(o=t[d],i);var R=m[E],k=r(R,i);R?a===k?E++:u.hasOwnProperty(a)&&r(m[E+1],i)===a?(O(d), P(E), E++):b(d,o):b(d,o), d++;}function O(e){var t={index:e,type:0};l.push(t);}function b(e,t){var n={index:e,item:t,type:1};l.push(n);}function P(e){m.splice(e,1);}return{moves:l,children:p}}}.diff,o={isString:function(e){return"string"==typeof e}},a={REPLACE:"REPLACE",REORDER:"REORDER",PROPS:"PROPS",TEXT:"TEXT"};function s(e,n){var r=n.patch;switch(n.type){case a.REPLACE:var i=o.isString(r)?r:t(r);e.parentNode.replaceChild(i,e);break;case a.REORDER:!function(e,n){for(var r,i,o,a,s=e.childNodes,c=(s.length, 0);c<n.length;c++)switch(r=n[c], i=r.index, o=r.item, a=s[i], r.type){case 0:e.removeChild(a);break;case 1:var f=t(o);e.insertBefore(f,a);}}(e,r.moves);break;case a.PROPS:!function(e,t){for(var n,r,i=Object.keys(t),o=0;o<i.length;o++)n=i[o], !1===(r=t[n])||void 0===r?e.removeAttribute(n):e.setAttribute(n,r);}(e,r);break;case a.TEXT:var s=document.createTextNode(r);e.parentNode.replaceChild(s,e);}}return{h:function(t,n,r){return new e(t,n,r)},render:t,diff:function(e,t){var n={};return function e(t,n,r,s){var c=[];if(null===n);else if(o.isString(t)&&o.isString(n))t!==n&&c.push({type:a.TEXT,patch:n});else if(t.tagName===n.tagName&&t.key===n.key){for(var f,u=t.props,h=n.props,l=Object.assign({},u,h),p=Object.keys(l),d={},v=0;v<p.length;v++)f=p[v], h[f]!==u[f]&&(d[f]=h[f]);Object.keys(d).length>0&&c.push({type:a.PROPS,patch:d});var g=t.children,y=i(g,n.children,"key"),m=y.moves,E=y.children;m.length>0&&c.push({type:a.REORDER,patch:{moves:m}});for(var R,k,O=null,b=r,P=0;P<g.length;P++)R=g[P], k=E[P], b+=O&&O.count?O.count:1, e(R,k,b,s), O=R;}else c.push({type:a.REPLACE,patch:n});c.length>0&&(s[r]=c);}(e,t,0,n), n},patch:function(e,t){!function e(t,n,r){var i=n[r];if(!o.isString(t))for(var a=t.childNodes,c=0;c<a.length;c++)e(a[c],n,++r);if(i)for(var f=0;f<i.length;f++)s(t,i[f]);}(e,t,0);}}});
});

var h = seb_min.h;
var render = seb_min.render;
var diff = seb_min.diff;
var patch = seb_min.patch;

/**
 * app
 *
 * @param  {VNode} 	tree
 * @param  {Object} actions
 * @param  {Object} state
 * @param  {HTMLElement} container
 */
function app(tree, actions, state, container) {
  var dom = render(tree);
  container.appendChild(dom);
}

var app_1 = app;
var h_1 = h;

var src = {
	app: app_1,
	h: h_1
};

exports.default = src;
exports.app = app_1;
exports.h = h_1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
