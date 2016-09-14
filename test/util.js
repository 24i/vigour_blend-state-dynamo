'use strict'

exports.out = (state) => {
  const path = state.path()
  const context = path[0]
  // fix this
  path.shift()
  return {
    key: path,
    context: context,
    val: state.val,
    stamp: state.stamp
  }
}
