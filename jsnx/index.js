"use strict";

require('regenerator/runtime');
var assign = require('./_internals/assign');

var classes = require('./classes');
var convert = require('./convert');
var generators = require('./generators');

module.exports = exports = {
  Map: require('./_internals/Map'),
  Set: require('./_internals/Set'),
  classes: classes,
  convert: convert,
  generators: generators,
};

assign(
  exports,
  classes,
  convert,
  generators
);
