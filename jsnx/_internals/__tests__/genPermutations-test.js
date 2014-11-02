/*global utils, assert*/
"use strict";

var genPermutations = require('../genPermutations');

exports.genPermutations = {
  permutations: function() {
    var permutations = genPermutations([0,1,2]);
    assert(utils.isIterator(permutations));
    assert.deepEqual(
      utils.toArray(permutations),
      [[0,1,2], [0,2,1], [1,0,2], [1,2,0], [2,0,1], [2,1,0]]
    );
  },

  'permutations size < elements': function() {
    var permutations = genPermutations([0,1,2], 2);
    assert(utils.isIterator(permutations));
    assert.deepEqual(
      utils.toArray(permutations),
      [[0,1], [0,2], [1,0], [1,2], [2,0], [2,1]]
    );
  },

  'permutations size > elements': function() {
    var permutations = genPermutations([0,1,2,3], 5);
    assert(utils.isIterator(permutations));
    assert.deepEqual(utils.toArray(permutations), []);
  },

  'empty sequence': function() {
    var permutations = genPermutations([]);
    assert(utils.isIterator(permutations));
    assert.deepEqual(utils.toArray(permutations), [[]]);
  }
};
