var _ = require('lodash/fp'),
    faker = require('faker'),
    fs = require('fs'),
    path = require('path')

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

function makeFake(fakeVal) {
  if (fakeVal.length == 1) {
    return _.get(fakeVal[0], faker).call()
  }
  if (fakeVal.length > 1) {
    let fkrArgs = _.slice(1, fakeVal.length - 1, fakeVal)
    return _.get(fakeVal[0], faker).apply(null, fkrArgs)
  }
  throw 'woops, not taking care of this case yet'
}

function genFake(json) {
  return _.map(x => _.mapValues(val => makeFake(val))(x), json)
}

fileData.then(x => {
  let data = JSON.parse(x)
  let output = _.compose(genFake, expand)(data)
  if (args.length == 1) { return process.stdout.write(JSON.stringify(output)) }
  if (args.length == 2) { return fs.writeFile(args[1], JSON.stringify(output), 'utf8', maybeError) }
}).catch(error)

