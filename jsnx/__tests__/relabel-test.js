/*globals assert, utils*/
"use strict";

var {Graph, DiGraph} = require('../classes/');

var relabel = require('../relabel');
var emptyGraph = require('../generators').emptyGraph;
var toArray = utils.toArray;

var {JSNetworkXError} = require('../exceptions');

exports.relabel = {

  testConvertNodeLabelsToIntegers: function() {
    // test that empty graph converts fine for all options
    var G = emptyGraph();
    var H = relabel.convertNodeLabelsToIntegers(G, 100);
    assert.equal(H.name, '(empty_graph(0))_with_int_labels');
    assert.deepEqual(H.nodes(), []);
    assert.deepEqual(H.edges(), []);

    ['default', 'sorted', 'increasing degree',
     'decreasing degree'].forEach(function(opt) {
        var G = emptyGraph();
        var H = relabel.convertNodeLabelsToIntegers(G, 100, opt);
        assert.equal(H.name, '(empty_graph(0))_with_int_labels');
        assert.deepEqual(H.nodes(), []);
        assert.deepEqual(H.edges(), []);
    });

    G = emptyGraph();
    G.addEdgesFrom([['A','B'],['A','C'],['B','C'],['C','D']]);
    G.name = 'paw';
    H = relabel.convertNodeLabelsToIntegers(G);
    var degH = toArray(H.degree().values());
    var degG = toArray(G.degree().values());
    assert.deepEqual(degH.sort(), degG.sort());

    H = relabel.convertNodeLabelsToIntegers(G, 1000);
    degH = toArray(H.degree().values());
    degG = toArray(G.degree().values());
    assert.deepEqual(degH.sort(), degG.sort());
    assert.deepEqual(H.nodes(), [1000, 1001, 1002, 1003]);

    H = relabel.convertNodeLabelsToIntegers(G, 'increasing degree');
    degH = toArray(H.degree().values());
    degG = toArray(G.degree().values());
    assert.deepEqual(degH.sort(), degG.sort());
    assert.equal(H.degree(0), 1);
    assert.equal(H.degree(1), 2);
    assert.equal(H.degree(2), 2);
    assert.equal(H.degree(3), 3);

    H = relabel.convertNodeLabelsToIntegers(G, 'decreasing degree');
    degH = toArray(H.degree().values());
    degG = toArray(G.degree().values());
    assert.deepEqual(degH.sort(), degG.sort());
    assert.deepEqual(H.degree(0), 3);
    assert.deepEqual(H.degree(1), 2);
    assert.deepEqual(H.degree(2), 2);
    assert.deepEqual(H.degree(3), 1);
  },

  testRelabelNodesCopy: function() {
    var G = emptyGraph();
    G.addEdgesFrom([['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']]);
    var mapping = {'A': 'aardvark','B': 'bear','C': 'cat','D': 'dog'};
    var H = relabel.relabelNodes(G, mapping);
    assert.deepEqual(H.nodes().sort(), ['aardvark', 'bear', 'cat', 'dog']);
  },

  testRelabelNodesFunction: function() {
    var G = emptyGraph();
    G.addEdgesFrom([['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']]);
    var H = relabel.relabelNodes(G, function(n) {
        return n.charCodeAt(0);
    });
    assert.deepEqual(H.nodes().sort(), [65, 66, 67, 68]);
  },

  testRelabelNodesGraph:  function() {
    var G = new Graph([['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']]);
    var mapping = {'A': 'aardvark','B': 'bear','C': 'cat','D': 'dog'};
    var H = relabel.relabelNodes(G, mapping);
    assert.deepEqual(H.nodes().sort(), ['aardvark', 'bear', 'cat', 'dog']);
  },

  testRelabelNodesDigraph: function() {
    var G = new DiGraph([['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']]);
    var mapping = {'A': 'aardvark','B': 'bear','C': 'cat','D': 'dog'};
    var H = relabel.relabelNodes(G, mapping, false);
    assert.deepEqual(H.nodes().sort(), ['aardvark', 'bear', 'cat', 'dog']);
  },

  /* TODO MultiGraph
  test_relabel_nodes_multigraph: function() {
    var G = MultiGraph([['a', 'b'], ['a', 'b']]);
    var mapping = {'a': 'aardvark','b': 'bear'};
    var H = relabel_nodes(G, mapping, false);
    assert.deepEqual(H.nodes().sort(), ['aardvark', 'bear']);
    assert.deepEqual(
      H.edges().sort(),
      [['aardvark', 'bear'], ['aardvark', 'bear']]
    );
  },
  */

  /* TODO MultiDiGraph
  test_relabel_nodes_multidigraph: function() {
    var G = MultiDiGraph([['a', 'b'], ['a', 'b']]);
    var mapping = {'a': 'aardvark','b': 'bear'};
    var H = relabel_nodes(G, mapping, false);
    assert.deepEqual(H.nodes().sort(), ['aardvark', 'bear']);
    assert.deepEqual(
      H.edges().sort(),
      [['aardvark', 'bear'], ['aardvark', 'bear']]
    );
  },
  */

  testRelabelNodesMissing: function() {
    var G = new Graph([['A', 'B'], ['A', 'C'], ['B', 'C'], ['C', 'D']]);
    var mapping = {'0': 'aardvark'};
    assert.throws(
      () => relabel.relabelNodes(G, mapping, false),
      JSNetworkXError
    );
  }

  //TODO: test_relabel_nodes_topsort
};
