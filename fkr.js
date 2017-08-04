#!/usr/bin/env node

var _ = require('lodash/fp'),
    faker = require('faker'),
    fs = require('fs')


function callFaker(arr) {
  if (!_.isArray(arr)) throw "Must use array form as value to 'fkr/fake' key"

  if (arr.length == 1) {
    return _.get(arr[0], faker).call()
  }

  if (arr.length > 1) {
    let fkrArgs = _.slice(1, arr.length, arr)
    return _.get(arr[0], faker).apply(null, fkrArgs)
  }
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

function walk(node) {
  if (_.isPlainObject(node)) {
    let keys = _.keys(node)

    if (detectExpansionKeys(keys)) return walk(expand(node))
    if (detectFakerMap(keys))      return callFaker(node['fkr/fake'])

    return _.compose(
      _.reduce(_.assign, {}),
      _.map(k => _.update(k, x => walk(x), {[k]: node[k]})) // TODO:: make this line less confusing
    )(keys)
  }

  if (_.isArray(node)) return _.map(x => _.isPlainObject(x) ? walk(x) : x)(node)

  return node
}

// TODO:: Should really have better error handlers
function error(err) { console.log('woops, error: ', err) }
function fileWriteErrorHandler(err) {
  if (err) throw err
  console.log('File successfully saved!')
}

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) reject(err)
      return resolve(data)
    })
  })
}

function toolExplanation() {
  var text = ""
  text += "\nThis is a quick command line tool for generating dummy data.\n"
  text += "takes a source file as an arguement, and optionally a destination file.\n"
  text += "extra arguements will be ignored currently.\n\n"
  text += "\te.g. 'fkr src/basic.json'\n"
  text += "\t     'fkr src/basic.json path/to/destination.json'\n\n"
  return text
}

function commandLineHandler() {
  let args = _.slice(2, process.argv.length, process.argv)

  if (args.length == 0) return process.stdout.write(toolExplanation())
  readFile(args[0])
    .then(data => {
      let output = walk(JSON.parse(data))

      if (args.length == 1) return process.stdout.write(JSON.stringify(output, null, 2))
      if (args.length == 2) return fs.writeFile(args[1], JSON.stringify(output, null, 2), 'utf8', fileWriteErrorHandler)
    })
    .catch(error)
}

commandLineHandler()
