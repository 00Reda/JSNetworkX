/*jshint strict:false, node:true*/
/*global assert */

var Map = require('../Map');
var forEach = require('../forEach');

function* generator(data) {
  for (var i = 0; i < data.length; i++) {
    yield data[i];
  }
}

exports.forEach = {
  'over arrays': function() {
    var data = [1,2,3];
    var counter = 0;
    forEach(data, function(v) {
      assert.equal(v, data[counter++]);
    });
    assert.equal(counter, data.length, 'iterated over all data');
  },

  'over iterables (e.g. Maps)': function() {
    var data = [[1,2], [2,3]];
    var map = new Map(data);
    var counter = 0;
    forEach(map, function(kv) {
      assert.deepEqual(kv, data[counter++]);
    });
    assert.equal(counter, data.length, 'iterated over all data');
  },

  'over iterators (e.g. from a generator)': function() {
    var data = [1,2,3];
    var iterator = generator(data);
    var counter = 0;
    forEach(iterator, function(v) {
      assert.equal(v, data[counter++]);
    });
    assert.equal(counter, data.length, 'iterated over all data');
  },

  'over objects (iterates over keys)': function() {
    var data = {foo: 0, bar: 1};
    var result = [];
    forEach(data, function(v) {
      result.push(v);
    });
    assert.sameMembers(result, Object.keys(data), 'iterated over all data');
  },

  // TODO
  'over graphs': false

};
