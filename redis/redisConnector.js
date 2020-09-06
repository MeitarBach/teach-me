const redis = require('promise-redis')();
const debug = require('debug')('teach-me:redis-connector');
const client = redis.createClient();

client.on('connect', function() {
    debug('Redis client connected');
});

client.on('error', function (err) {
    debug('Something went wrong ' + err);
});

module.exports = client;