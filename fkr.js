var _ = require('lodash/fp'),
    faker = require('faker'),
    fs = require('fs'),
    path = require('path')

// ::TODO ... MAYBE
// I may write write this in clojurescript so I can get use transit to consume edn...
// because I think the format will be a bit more terse

// not really a fan of lodash/fp slice as far as I can tell,
// because you can't default to end of array
let args = _.slice(2, 8, process.argv)
let fileArg = process.argv[2]

// Super dumb error handler stub
function error(err) { console.log('woops, err: ', err) }

function maybeError(err) {
  if (err) throw err
  console.log('File successfully saved!')
}

let fileData = new Promise((resolve, reject) => {
  fs.readFile(fileArg, 'utf8', (err, data) => {
    if (err) reject(err)
    return resolve(data)
  })
})

function callFaker(arr) {
  if (arr.length == 1) {
    return _.get(arr[0], faker).call()
  }
  if (arr.length > 1) {
    let fkrArgs = _.slice(1, 8, arr)
    return _.get(arr[0], faker).apply(null, fkrArgs)
  }
  throw "can't work with an empty array, or whatever this is"
}

function expand(json) {
  let shape = json["fkr/structure"]
  return _.times(_.constant(json["fkr/structure"]), json["fkr/times"])
}

function detectFakerMap(keys) {
  return (keys.length == 1 && keys[0] == 'fkr/fake')
}

function detectExpansionKeys(keys) {
  return (keys.length == 2 && _.isEqual(keys, ['fkr/times', 'fkr/structure']))
}

function recursivelyExpand(tree) {
  if (!_.isArray(tree) && _.isObject(tree)) {
    let keys = _.keys(tree)

    if (detectExpansionKeys(keys)) {
      let expanded = expand(tree),
          maybe = recursivelyExpand(expanded)
      return maybe
    }

    if (detectFakerMap(keys)) {
      return callFaker(tree['fkr/fake'])
    } else {
      let maybeExpand = _.map(k => _.update(k, (x) => recursivelyExpand(x), {[k]: tree[k]}), keys)
      let ack = _.reduce(_.assign, {}, maybeExpand)
      return ack
    }
  }

  if (_.isArray(tree)) {
    return _.map(node => {
      if (!_.isArray(node) && _.isObject(node)) {
        return recursivelyExpand(node)
      } else {
        return node
      }
    }, tree)
  }
}

fileData.then(data => {
  let output = recursivelyExpand(JSON.parse(data))
  if (args.length == 1) { return process.stdout.write(JSON.stringify(output, null, 2)) }
  if (args.length == 2) { return fs.writeFile(args[1], JSON.stringify(output, null, 2), 'utf8', maybeError) }
}).catch(error)
