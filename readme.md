# pull-drain

> Pull stream sink that drains source stream's data

A [pull stream](https://github.com/pull-stream/pull-stream) sink that calls function for each data in the stream.

```js
pull(
  values(1, 2, 3),
  map(x => x * 2),
  drain(x => console.log(x))
)(function (err) {
  // Finished
})
```

**Note:** This is a [continuable](https://github.com/pull-stream/pull-stream/pull/89).

## Installation

```sh
$ npm install --save pull-drain
```

## Usage

### `drain(op)`

Drain stream data, calling `op` for each read.

```js
pull(
  count(50),
  map(x => [x, x % 2 === 0])
  drain(x => console.log(x))
)(function (err) {
  // Finished
})

// No callback:
pull(
  ...streams,
  drain(x => console.log(x))
)()
```

Return `false` inside the `op` function to abort the stream.

### `drain(op).abort([err])`

To abort the stream from outside the callback, you can use an `.abort` method, and optionally pass it an error:

```js
var drainer = drain(function (item) {
  // ...
})

if (foo) {
  drainer.abort(new Error('Foo!'))
}

pull(
  infinity(),
  drainer
)(function (err) {
  // You got an error!
})
```

## License

MIT © [Jamen Marz](https://git.io/jamen)

---

[![version](https://img.shields.io/npm/v/pull-drain.svg?style=flat-square)][package] [![travis](https://img.shields.io/travis/Jamen%20Marzonie/pull-drain.svg?style=flat-square)](https://travis-ci.org/jamen/pull-drain) [![downloads](https://img.shields.io/npm/dt/pull-drain.svg?style=flat-square)][package] [![license](https://img.shields.io/npm/l/pull-drain.svg?style=flat-square)][package] [![support me](https://img.shields.io/badge/support%20me-paypal-green.svg?style=flat-square)](https://paypal.me/jamenmarz/5usd) [![follow](https://img.shields.io/github/followers/Jamen%20Marzonie.svg?style=social&label=Follow)](https://github.com/Jamen%20Marzonie)

[package]: https://npmjs.org/package/pull-drain
