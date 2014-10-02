/**
 * Created by syzer on 7/24/2014.
 * Its just a Proof of Concept
 */
var io,
    ioServer,
    clients = [],           // TODO in redis
    jsSpark,
    manager,
    serializer,
    _;


var ROOT = './private/src/server/';
// DI container
var services = require(ROOT + 'config/di').services;

// setup Dependencies
var di = require(ROOT + 'controller/di')(services);

// lodash
_ = di.get('_');

io = di.get('io');
ioServer = di.get('io.server');
console.log('Io server listening on 8000');

serializer = di.get('service.serializer');
jsSpark = di.get('service.jsSpark');
manager = di.get('service.manager');
manager.init();

var task;

task = jsSpark(_.range(10))
    .map(function multiplyBy2(el) {
        return el * 2;
    })
    .filter(function remove5and10(el) {
        return el % 5 !== 0;
    })
    // sum of  [ 2, 4, 6, 8, 12, 14, 16, 18 ] => 80
    .reduce(function sumUp(arr, el) {
        return arr + el;
    })
//    .sortBy(function(num){
//        return num;
//    })
    .createTask();

// #TODO we are not going to call that directly, it will be called by createTask of jsSpark.
manager.addTask(task);
//console.log(task);