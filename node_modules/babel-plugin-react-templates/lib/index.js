'use strict';

var _babylon = require('babylon');

var _reactTemplates = require('react-templates/src/reactTemplates');

var _reactTemplates2 = _interopRequireDefault(_reactTemplates);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_RT_OPTIONS = {
  targetVersion: '0.14.0',
  modules: 'es6'
};

/*
 * Take template relative path, read the file, and write the compiled JS template
 */

function fnCompiledTemplate(node_path, plugin, opts) {
  var base_path = _path2.default.dirname(plugin.file.opts.filename),
      absolute_path = _path2.default.resolve(base_path, opts.relative_path),
      rt_options = Object.assign(DEFAULT_RT_OPTIONS, plugin.opts),
      source = _fs2.default.readFileSync(absolute_path, { encoding: 'utf8' }),
      compiled_template = _reactTemplates2.default.convertTemplateToReact(source, rt_options),
      compiled_filename = '_' + _path2.default.basename(opts.relative_path).replace(opts.reg_ext, '.rt.js'),
      compiled_path = _path2.default.resolve(base_path, compiled_filename);
  _fs2.default.writeFileSync(compiled_path, compiled_template, 'utf8');
  return compiled_path;
}

module.exports = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {

      /*
       * Catch Template import declarations
       */

      ImportDeclaration: {
        enter: function enter(node_path, plugin) {
          var relative_path = node_path.node.source.value,
              ext = plugin.opts.ext || '.rt.html',
              reg_ext = new RegExp(ext + '$');
          if (reg_ext.test(relative_path)) {
            var compiled_path = fnCompiledTemplate(node_path, plugin, {
              relative_path: relative_path,
              ext: ext,
              reg_ext: reg_ext
            });
            node_path.node.source.value = compiled_path;
          }
        }
      },

      /*
       * Catch Template require calls
       */

      CallExpression: {
        enter: function enter(node_path, plugin) {
          if (node_path.node.callee.name === 'require') {
            var args = node_path.node.arguments;
            if (args.length && t.isStringLiteral(args[0])) {
              var ext = plugin.opts.ext || '.rt.html',
                  reg_ext = new RegExp(ext + '$'),
                  relative_path = args[0].value;
              if (reg_ext.test(relative_path)) {
                var compiled_path = fnCompiledTemplate(node_path, plugin, {
                  ext: ext,
                  reg_ext: reg_ext,
                  relative_path: relative_path
                });
                // React Templates exports templates in ES6 as export default
                node_path.replaceWithSourceString('require(\'' + compiled_path + '\').default');
              }
            }
          }
        }
      }
    }
  };
};