/**
 * Build tool module for the-m-project
 *
 * @copyright 2010, M-WAY Solutions GmbH
 */
var Plugin = require("cloud9/plugin");
var Fs = require("fs");
var Path = require("path");
var Async = require("async");
var Sys = require("sys");
var IO = require("socket.io");

var TheMProject = module.exports = function (ide) {
    this.ide = ide;
    this.hooks = ["command"];
    this.name = "themproject";
    this.server = '';
    this.client = '';
};

Sys.inherits(TheMProject, Plugin);

(function () {

    this._getParameters = function (message) {
        var node = process.argv[0];
        var espresso = [__dirname + '/espresso/bin/espresso.js'];
        var params = message.argv.slice(1);
        var dirIndex = params.indexOf('-d');

        if (dirIndex !== -1) {
            params[dirIndex + 1] = this.ide.workspaceDir + params[dirIndex + 1];
        } else {
            params = params.concat(['-d', this.ide.workspaceDir]);
        }

        return espresso.concat(params);
    };

    this.command = function (user, message, client) {
        var that = this;
        that.client = client;
        if (!that[message.command]) {
            return false;
        }
        that[message.command](message);

        if (!that.server) {
            that.server = require('socket.io').listen(11882);
            that.server.set('log level', 1); //reduce output

            that.server.sockets.on('connection', function (socket) {
                socket.on('espressoMessage', function (data) {
                    that.client.send(JSON.stringify({
                        "type"      : "themproject",
                        "subtype"   : data.subtype ? data.subtype : 'isCalling',
                        "data"      : data
                    }));
                });
            });

            that.server.sockets.on('disconnect', function () {
                console.log('disconnect', arguments);
            });

        }

        return true;
    };

    /*
     this.$commandHints = function (commands, message, callback) {
     console.dir(commands);
     callback();
     };
     */

    this.espresso = function (message) {
        console.log('message:', message);
        var self = this;
        if (message.argv) {

            var params = this._getParameters(message);

            this.spawnCommand('node', params, message.cwd, null, null, function (code, err, out) {

                self.sendResult(0, message.command, {
                    code: code,
                    argv: message.argv,
                    err: err,
                    out: out
                });
            });
        } else {
            console.log('received this message', message);
        }
    };

}).call(TheMProject.prototype);
