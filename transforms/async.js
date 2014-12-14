/**
 * @fileoverview
 * This transform creates a sync copy of all async functions and changes the
 * async function to call a delegate instead. I.e. the function
 *
 * async function foo(a, b, c) {
 *  // implementation
 * }
 *
 * module.exports = {foo};
 *
 * is converted to
 *
 * var delegateName = require('./path/to/delegateName');
 *
 * function gen_foo(a, b, c) {
 *   return delegateName('foo', [a, b, c]);
 * }
 *
 * function foo(a, b, c) {
 *   // implementation
 * }
 *
 * module.exports = {foo}
 * module.exports.gen_foo = gen_foo;
 */

"use strict";
var _ = require('lodash');
var acorn = require('acorn-6to5');
var path = require('path');
var recast = require('recast');
var types = recast.types;
var builders = types.builders;

var parseWrapper = {
  parse: function(source, options) {
    return acorn.parse(source, _.assign({
      ecmaVersion: 7,
      locations: options.loc,
      ranges: options.range,
    }, options));
  }
};

/**
 * This builds the call to the delegate function, i.e.
 *
 * return delegateName('functionName', args);
 */
function buildCallTo(delegateName, functionName, args) {
  return builders.returnStatement(
    builders.callExpression(
      builders.identifier(delegateName),
      [
        builders.literal(functionName),
        builders.arrayExpression(args)
      ]
    )
  );
}

/**
 * This builds an require call to load the file located at `path` into `name`,
 * i.e.
 *
 * var name = require('path');
 */
function buildRequireStatement(path, name) {
  return builders.variableDeclaration('var', [
    builders.variableDeclarator(
      builders.identifier(name),
      builders.callExpression(
        builders.identifier('require'),
        [builders.literal(path)]
      )
    )
  ]);
}

/**
 * Creates an module.exports assignment expression.
 */
function buildExportStatement(name) {
  return builders.expressionStatement(
    builders.assignmentExpression(
      '=',
      builders.memberExpression(
        builders.memberExpression(
          builders.identifier('module'),
          builders.identifier('exports'),
          false
        ),
        builders.identifier(name),
        false
      ),
      builders.identifier(name)
    )
  );
}

/**
 * Makes the actual transformation
 */
function transform(source, options) {
  if (!/^\s*async function/m.test(source)) {
    return {code: source};
  }
  // acorn-6to5 isn't able to parse async generators. So we just collect their
  // names and remove "async"
  var asyncGeneratorNames = [];
  source = source.replace(
    /^(\s*)async function\* ([^(]+)/gm,
    function(match, ws, name) {
      asyncGeneratorNames.push(name);
      return ws + 'function* ' + name;
    }
  );

  var ast = recast.parse(source, {
    esprima: parseWrapper,
    sourceFileName: options.filename,
  });
  var delegateName = options.delegateName;
  var asyncFuncs = [];

  if (options.filename.indexOf(options.delegateName) === -1) {
    types.visit(ast, {
      /**
       * We only care about functions in the top level of the module.
       */
      isTopLevel: function(path) {
        return path.parent.node === ast.program;
      },

      /**
       * Removes `awaits` from a descendant of a node.
       */
      removeAwaits: function(path) {
        types.visit(path, {
          visitAwaitExpression: function(path) {
            path.replace(path.value.argument);
            this.traverse(path);
          }
        });
      },

      visitProgram: function(p) {
        this.traverse(p);
        if (asyncFuncs.length > 0) {
          // If we found any async functions, we have to require the delegate
          // method.
          var delegatePath = path.join(path.relative(
            path.dirname(options.filename),
            path.resolve(options.delegatePath)
          ), delegateName);

          var moduleBody = p.get('body');
          moduleBody.unshift(
            buildRequireStatement(delegatePath, delegateName)
          );

          // We also have to export the newly generated functions.
          asyncFuncs.forEach(function(name) {
            moduleBody.push(buildExportStatement(name));
          });
        }
      },

      visitFunctionDeclaration: function(path) {
        var node = path.node;
        var name = node.id.name;
        if ((node.async || asyncGeneratorNames.indexOf(name) > -1) && this.isTopLevel(path)) {
          // If the function is async and at the top level, we make it
          // sync and insert an async version after it.
          this.makeSync(path);
          this.createAsyncCopy(path);
        }
        return false;
      },

      makeSync: function(path) {
        path.get('async').replace(false);
        this.removeAwaits(path);
      },

      createAsyncCopy: function(path) {
        var node = path.node;
        var name = node.id.name;
        var asyncName = 'gen' + name[0].toUpperCase() + name.substr(1);
        // The function doesn't actually have to be marked as async, since the
        // delegate function returns a promise anyway.
        var funcDeclaration = builders.functionDeclaration(
          builders.identifier(asyncName),
          node.params,
          builders.blockStatement([
            buildCallTo(delegateName, node.id.name, node.params)
          ])
        );
        path.insertAfter(funcDeclaration);
        asyncFuncs.push(asyncName);
      }
    });
  }
  return recast.print(ast, {sourceMapName: options.filename});
}

module.exports = transform;
