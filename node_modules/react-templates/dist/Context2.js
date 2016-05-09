'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var packagesUtils = require('./packagesUtils');

/**
 * Enum for tri-state values.
 * @enum {string}
 */
var MESSAGE_LEVEL = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO'
};

var Context2 = function () {
    function Context2() {
        _classCallCheck(this, Context2);

        this.messages = [];
        this.color = true;
        this.cwd = process.cwd();
        this.packagesDir = packagesUtils.defaults.packagesDir;
        this.sourceMain = packagesUtils.defaults.sourceMain;
        this.testMain = packagesUtils.defaults.testMain;
        this.testMainTemplate = packagesUtils.defaults.testMainTemplate;
        this.rjsMainTemplate = packagesUtils.defaults.rjsMainTemplate;
        this.rjsMainMin = packagesUtils.defaults.rjsMainMin;
    }

    _createClass(Context2, [{
        key: 'report',
        value: function report(msg) {
            console.log(msg);
        }
    }, {
        key: 'verbose',
        value: function verbose(message) {
            if (this.options.verbose) {
                this.report(message);
            }
        }
    }, {
        key: 'info',
        value: function info(msg, file, line, column) {
            this.issue(MESSAGE_LEVEL.INFO, msg, file, line, column);
        }
    }, {
        key: 'warn',
        value: function warn(msg, file, line, column) {
            this.issue(MESSAGE_LEVEL.WARN, msg, file, line, column);
        }
    }, {
        key: 'error',
        value: function error(msg, file, line, column) {
            this.issue(MESSAGE_LEVEL.ERROR, msg, file, line, column);
        }
    }, {
        key: 'issue',
        value: function issue(level, msg, file, line, column) {
            this.messages.push({ level: level, msg: msg, file: file || null, line: line || -1, column: column || -1 });
        }
    }, {
        key: 'getMessages',
        value: function getMessages() {
            return this.messages;
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.messages = [];
        }
    }, {
        key: 'hasErrors',
        value: function hasErrors() {
            return _.some(this.messages, { level: MESSAGE_LEVEL.ERROR });
        }
    }, {
        key: 'getPackagesRoot',
        value: function getPackagesRoot() {
            return packagesUtils.getPackagesRoot(this.cwd, this.packagesDir);
        }
    }, {
        key: 'getPackageMain',
        value: function getPackageMain(packageName) {
            return packagesUtils.getPackageMain(this.cwd, packageName, this.packagesDir, this.sourceMain);
        }
    }, {
        key: 'getPackageMainEntry',
        value: function getPackageMainEntry(packageName) {
            return packagesUtils.getPackageMainEntry(this.cwd, packageName, this.packagesDir, this.sourceMain);
        }
    }]);

    return Context2;
}();

module.exports = Context2;