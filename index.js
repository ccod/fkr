var _ = require('lodash/fp'),
    faker = require('faker'),
    fs = require('fs'),
    path = require('path')

let fileArg = process.argv[2]

let fileData = new Promise((resolve, reject) => {
  fs.readFile(fileArg, 'utf8', (err, data) => {
    if (err) reject(err)
    return resolve(data)
  })
})

// making assumptions about the shape of the data
function expand(json) {
  let shape = json["fkr/structure"]
  return _.times(_.constant(json.structure), json["fkr/times"])
}

function makeFake(fakeVal) {
  if (fakeVal.length == 1) {
    return _.get(fakeVal[0], faker).call()
  }
  if (fakeVal.length > 1) {
    let fkrArgs = _.slice(fakeVal, 1)
    faker.apply(null, fkrArgs) 
  }
}

function genFake(json) {
  let myFn = (obj) => {
    _.keys(objs)
  }
  _.map()
}

fileData.then(x => {
  let data = JSON.parse(x)
  let output = expand(data)
  console.log('how many time?: ', output);
})

