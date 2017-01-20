var test = require('tape')
var pull = require('pull-stream')
var drain = require('./')
var values = pull.values
var map = pull.map
var count = pull.count
var error = pull.error

test('drains', function (t) {
  t.plan(2)

  var result = []
  pull(
    values([1, 2, 3, 4, 5]),
    map(x => x * 3),
    drain(x => result.push(x))
  )(function (err) {
    t.false(err, 'no error')
    t.same(result, [3, 6, 9, 12, 15], 'drains')
  })
})

test('abort', function (t) {
  t.plan(5)

  var result = []
  pull(
    count(20),
    drain(function (item) {
      var i = result.push(item)
      if (i > 3) return false
    })
  )(function (err) {
    t.false(err, 'no error')
    t.same(result, [0, 1, 2, 3], 'aborts with return false')
  })

  var drainer = drain(function (item) {
    var i = result.push(item)
    if (i > 9) drainer.abort()
  })
  pull(
    count(20),
    drainer
  )(function (err) {
    t.false(err, 'no error again')
    t.same(result, [0, 1, 2, 3, 0, 1, 2, 3, 4, 5], 'aborts with .abort method')
  })

  var empty = []
  var earlyAbort = drain(function (item) {
    empty.push(item)
  })
  earlyAbort.abort()
  pull(
    count(20),
    earlyAbort
  )(function (err) {
    t.false(empty.length, 'aborts early')
  })
})

test('error', function (t) {
  t.plan(2)

  pull(
    error(new Error('test error')),
    drain(function (item) {
      t.fail('does not drain')
    })
  )(function (err) {
    t.is(err.message, 'test error', 'has normal error')
  })

  var drainer = drain(function (item) {
    if (item > 5) drainer.abort(new Error('test error'))
  })

  pull(
    count(10),
    drainer
  )(function (err) {
    t.is(err.message, 'test error', 'has abort error')
  })
})
