"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.closeDB = function () {
        this.db.close();
    };
    MetricsHandler.prototype.save = function (username, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + username + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    MetricsHandler.prototype.get = function (username, callback) {
        var stream = this.db.createReadStream();
        var met = [];
        stream.on('error', callback)
            .on('data', function (data) {
            var user = data.key.split(':')[1];
            var timestamp = data.key.split(':')[2];
            var value = data.value;
            if (username === user) {
                met.push(new Metric(timestamp, value));
            }
        })
            .on('end', function (err) {
            callback(null, met);
        });
    };
    MetricsHandler.prototype.delete = function (key, callback) {
        this.db.del(key, function (err) {
            callback(err);
        });
    };
    MetricsHandler.prototype.edit = function (username, timestamp, value, callback) {
        var key = "metric:" + username + ":" + timestamp;
        this.delete(key, function (err) {
            if (err)
                throw err;
        });
        var metric = [
            new Metric("" + new Date().getTime(), parseFloat(value))
        ];
        this.save(username, metric, function (err) {
            if (err)
                throw err;
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
