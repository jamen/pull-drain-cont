module.exports = drain

function drain (op) {
  var draining = true
  var aborted = false

  function sink (read) {
    return function (done) {
      done = done || loud

      if (aborted) {
        return done(aborted === true ? null : aborted)
      }

      while (draining) {
        read(null, function (end, data) {
          if (end) {
            draining = false
            return done(end === true ? null : end)
          }

          if (op && op(data) === false || aborted) {
            draining = false
            done(aborted === true ? null : aborted)
          }
        })
      }
    }
  }

  function abort (err) {
    aborted = err || true
  }

  sink.abort = abort
  return sink
}

function loud (err) {
  throw err
}
