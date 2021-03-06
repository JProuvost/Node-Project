"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var passwordHash = require('password-hash');
var User = /** @class */ (function () {
    function User(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = passwordHash.isHashed(password); }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else {
            this.password = password;
        }
    }
    User.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new User(username, email, password);
    };
    User.prototype.setPassword = function (toSet) {
        // Hash and set password
        this.password = passwordHash.generate(toSet);
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.validatePassword = function (toValidate) {
        // return comparison with hashed password
        return passwordHash.verify(toValidate, this.password);
    };
    return User;
}());
exports.User = User;
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.LevelDB.open(path);
    }
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else {
                callback(null, User.fromDb(username, data));
            }
        });
    };
    UserHandler.prototype.getAll = function (callback) {
        var stream = this.db.createReadStream();
        var users = [];
        stream.on('error', callback)
            .on('data', function (data) {
            //console.log(data)
            var username = data.key.split(':')[1];
            //console.log(username)
            users.push(User.fromDb(username, data.value));
        })
            .on('end', function (err) {
            callback(null, users);
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        this.db.del("user:" + username, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.closeDB = function () {
        this.db.close();
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
