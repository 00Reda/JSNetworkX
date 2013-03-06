# JSNetworkX - NetworkX for JavaScript

**JSNetworkX** is a port of [NetworkX](http://networkx.lanl.gov/) v1.6, a popular
graph library for Python, to JavaScript.

JSNetworkX allows you to build, process and analyze graphs in JavaScript. It 
can be used together with [D3.js](http://d3js.org/) in the browser to create 
interactive graph visualizations.

Have a look at the [wiki](https://github.com/fkling/JSNetworkX/wiki) for more information.

## How to use

### Browser
Simply download [jsnetworkx.js](jsnetworkx.js) and include it in your page:

    <script src="jsnetworkx.js></script>

The [`dist/` folder](dist/) contains different versions, depending on your needs. These
are:

- `jsnetworkx-min.js`: Contains only graph classes and utilties, no algorithms,
  generators, visualization etc.
- `jsnetworkx-drawing.js`: Like the min version, but with visualization.
- `jsnetworkx-node.js`: A special node version with everything but
  visualization.

If you want to visualize graphs, you have to include [D3.js](http://d3js.org/)
as well.

### Node
Install JSNetworkX with

    npm install https://github.com/fkling/JSNetworkX.git

The package will be made available as official node module once it reaches an
undetermined feature completeness level.

## How to build

If you want to contribute to JSNetworkX or just want to choose which modules 
are included in the library, you want to build JSNetworkX yourself.

JSNetworkX uses [grunt](http://gruntjs.com/) as build system, which sits on top 
of [Node](http://nodejs.org/) (you will also need [npm](https://npmjs.org/)).

If you followed the instructions to install Node and npm, you can install the 
grunt command line interface with:

    npm install -g grunt-cli

The `package.json` file contains a set of node packages which JSNetworkX needs in
addition to grunt. You can install those locally by executing the following 
command in your JSNetworkX clone:

    npm install ./ --dev

Last but not least, since JSNetworkX uses the [Google closure
library](https://developers.google.com/closure/library/) and the
[Google closure compiler](https://developers.google.com/closure/compiler/), you 
have to provide those as well, in the folders `vendor/closure_library` and 
`vendor/closure_compiler` resp.  
The closure library can be installed via Git:

    mkdir vendor/
    git clone https://code.google.com/p/closure-library/

If the files in `vendor/closure-library/closure/bin` are not executable, change
them to be:

    chmod -R +x vendor/closure-library/closure/bin/*

Download the compiler with

    wget -nc http://closure-compiler.googlecode.com/files/compiler-latest.zip \
    && unzip compiler-latest.zip -d vendor/closure-compiler/ \
    && rm compiler-latest.zip

---

Now we are ready to build! To check whether the closure library and compiler are
correctly installed, run

    grunt check

All versions of JSNetworkX are build via `grunt compile`. This task accepts
different targets:

- `grunt compile:min` builds a version only containing base classes and
  utilities (no algorithms, generators or drawing).
- `grunt compile:drawing` like `min`, but includes drawing.
- `grunt compile:all` includes everyting.
- `grunt compile:node` like, `all`, but without drawing.
- `grunt compile:custom` like, `min`, but also includes all modules specified 
 with the `--ns` options. The modules can be passed with or without the leading 
 `jsnx.` namespace.

All builds apart from `all` and `custom`  are put into `dist/`.

Here are some examples for custom builds:

This will build JSNetworkX with all generators:

    grunt compile:custom --ns=generators

It is the same as 

    grunt compile:custom --ns=jsnx.generators

This build only contains the ismorphism algorithms and classic generators:

    grunt compile:custom --ns=algorithms.isomorphism,generators.classic

**Note:** Most modules have internal dependencies, so the final build will
likely contain other modules as well.
