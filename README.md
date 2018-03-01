# slimapp [![Build Status](https://travis-ci.org/stop2stare/slimapp.svg?branch=master)](https://travis-ci.org/stop2stare/slimapp) [![codecov](https://codecov.io/gh/stop2stare/slimapp/branch/master/graph/badge.svg)](https://codecov.io/gh/stop2stare/slimapp) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Simplest MVVM

## Background

A practice of [hyperapp](https://github.com/hyperapp/hyperapp)

## Usage

Checkout the [examples](https://github.com/stop2stare/slimapp/blob/master/examples)

Slimapp provides two functions: `h` and `app`.

### `h`

`h` helps you to build your vdom

``` js
var vdom = h('span', {class: 'test'}, ['text'])
// vdom: {
//  tagName: 'span',
//  key: undefined,
//  props: {class: 'test'},
//  children: ['text']
// }
```

### `app`

`app` helps you to start your app

``` js
var view = function(actions, state) {
  return h('p', {}, [state.a])
}
var actions = {
  add: data => state => { state.a += data },
  minus: data => state => { state.a -= data }
}
var state = {
  a: 1
}
var vm = app(view, actions, state, document.body)

console.log(document.body.innerHTML) // '<p>1</p>'

vm.add(1) // '<p>2</p>'
vm.minus(3) // '<p>-1</p>'
```
