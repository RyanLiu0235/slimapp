var h = require('../src/h')
var VNode = require('../src/vnode')

test('h', () => {
  var vdom = h('p', {}, ['test', h('span')])
  expect(vdom).toBeInstanceOf(VNode)
  expect(vdom).toMatchObject({
    tagName: 'p',
    props: {},
    key: undefined,
    children: [
      'test',
      {
        tagName: 'span',
        props: {},
        key: undefined,
        children: []
      }
    ]
  })
})
