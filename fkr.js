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

// making assumptions about the shape of the data
function expand(json) {
  let shape = json["fkr/structure"]
  return _.times(_.constant(json["fkr/structure"]), json["fkr/times"])
}

// maybe stack frame problems if I am not careful??
function recursivelyExpand(json) {

}

function recursivelyFake(json) {

}

function callFaker(arr) {
  if (arr.length == 1) {
    return _.get(arr[0], faker).call()
  }
  if (arr.length > 1) {
    let fkrArgs = _.slice(1, 8, arr )
    return _.get(arr[0], faker).apply(null, fkrArgs)
  }
  throw "can't work with an empty array, or whatever this is"
}

// there is a bug here, having to do with slice
function makeFake(fakeVal) {
  if (_.isObject(fakeVal) && fakeVal['fkr/fake']) {
    return callFaker(fakeVal['fkr/fake'])
  }
  return fakeVal
}

function genFake(json) {
  return _.map(x => _.mapValues(val => makeFake(val))(x), json)
}

fileData.then(x => {
  let data = JSON.parse(x)
  let output = _.compose(genFake, expand)(data)
  // if (args.length == 1) { return process.stdout.write(JSON.stringify(output)) }
  if (args.length == 1) { console.log(output) }
  if (args.length == 2) { return fs.writeFile(args[1], JSON.stringify(output), 'utf8', maybeError) }
}).catch(error)
