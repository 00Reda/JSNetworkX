# JSNetworkX - NetworkX for JavaScript

JSNetworkX is a port of NetworkX, a graph library for Python, to JavaScript. 

The following libraries are used by JSNetworkX:

- Jasmine for testing
- Google Closure Library as base framework
- D3 for visualization

The Google Closure Compiler is used to minimize and optimize the code.


## Development
The development for JSNetworkX has just started, the rough roadmap is as follows:

- Port units to Jasmine
- Port base classes
- Implement renderer with D3

To ease the developement, we built JSNetworkX on top of Google Closure Library. This allows us also to use some more adanvaced features of the Google Closure Compiler and provides
a solid structure for the code.

Stay tuned!


## Important differences from the Python version

JavaScript is not Python, therefore, some of the more advanced features, such as generators or certain magic methods are not available. This is a list of the most significant differences.

### Data types which can be nodes

In Python, each *hashable* object can be a node. This holds for JavaScript as well, to some degree. Since nodes are stored as keys of an object, all nodes are essentially mapped to strings.  
This bears no problem for strings or numbers (but see below!) but each other type has to be handled with care. For example, the default string representation of any object is `[object Object]`. This implies that even two different objects will map to the same node.  
So, each object/value which should be used as a node, has to override the `toString()` method, if necessary.

Even more attention has to be paid when retrieving nodes from the graph. Since all nodes are converted to string, only the string representation of the node can be returned (e.g. node `1` becomes `'1'`).

If the original data is required, it is adviced to either add it as a node data or maintain an external map.


### Node access

In Python, one can simply access a node of a graph using `G[n]`. Theoretically this is possible in JavaScript as well, but to keep the implementation simple, JSNetworkX does not provide this possibility. Instead, one has to use either `G.get_node(n)` or simply `G.node[n]`.


### Iterators and Generators

The official JavaScript standard (ECMAScript) does not support iterators yet. Mozilla's javaScript implementation provides them in version 1.7. But since this is not supported by other browsers, it is not really usabled. Nevertheless, we use Closure's iterator implementation which is compatiable to Mozilla's.

Each object which implements an `.__iterator__()` function which returns an object having a `.next()` method (can be the same object) can be used as iterator.

Such an object is returned by each graph method which is supposed to return a generator.

Add example how to use it here...


### Keyword arguments

JavaScript only provides positional arguments. In keys a method acceptes a variable number of keyword arguments, a dictionary (object) has to be passed instead.  
For example, adding a node with data:

    G.add_node('foo', data=42)

becomes

    G.add_node('foo', {data: 42});

### Optional arguments

Some methods have one or more optional arguments. In Python one can simply use keyword arguments to pass the desired arguments. In JSNetworkX, optional arguments can be omitted, as long as the arguments are of different types and therefore distinguishable.

For example, this is ok:

    // Python: G.edges(data=true)
    G.edges(true);

but this is ambigious:

    // Python: G.degree(weight='weight')
    G.degree('weight'); // get node with name 'weight' or is the weight attribute name 'weight' ?

In this case we decided to interpret the argument as node name. To set the `weight` attribute name and get all nodes, `null` or `undefined` has to be passed as first argument:

    G.degree(null, 'weight');
