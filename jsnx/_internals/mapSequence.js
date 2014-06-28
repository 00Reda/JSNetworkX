"use strict";

var isArrayLike = require('./isArrayLike');
var isIterable = require('./isIterable');
var isIterator = require('./isIterator');
var isPlainObject = require('lodash-node/modern/objects/isPlainObject');
var mapIterator = require('./itertools/mapIterator.js');
var mapValues = require('lodash-node/modern/objects/mapValues');

var nativeMap = Array.prototype.map;

/**
 * Helper to map sequence types (arrays, array-like objects, objects, etc).
 * Note that if an array-like object is passed, an array is returned:
 *
 * Array -> Array
 * ArrayLike -> Array
 * Iterator -> Iterator
 * Iterable -> Iterator
 * Object -> Object
 *
 * @param {Iterable} sequence
 * @param {function(this:T,...)} callback
 * @param {T=} this_obj
 * @template T
 *
 * @return {(Array|Object|Iterator)}
 */
function mapSequence(sequence, callback, this_obj) {
  if (isArrayLike(sequence)) {
    return nativeMap.call(sequence, callback, this_obj);
  }
  else if (isIterable(sequence)) {
    sequence = sequence['@@iterable']();
  }
  if (isIterator(sequence)) {
    return mapIterator(sequence, callback, this_obj);
  }
  else if(isPlainObject(sequence)) {
    return mapValues(sequence, callback, this_obj);
  }
  else {
    throw new TypeError(
      "Can't map value of type %s",
      typeof sequence
    );
  }
}

module.exports = mapSequence;
