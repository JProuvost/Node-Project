"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var users_1 = require("../users");
var leveldb_1 = require("../leveldb");
var dbPath = './db_test';
var dbUsers;
var passwordHash = require('password-hash');
describe('User', function () {
    before(function () {
        leveldb_1.LevelDB.clear(dbPath);
        dbUsers = new users_1.UserHandler(dbPath);
    });
    after(function () {
        dbUsers.closeDB();
    });
    describe('#get', function () {
        it("shouldn't get any user", function (done) {
            dbUsers.get("0", function (err, result) {
                chai_1.expect(err).to.not.be.null;
                chai_1.expect(result).to.be.undefined;
                done();
            });
        });
    });
    describe('#get & #save ', function () {
        it('should save and get one', function (done) {
            var user = new users_1.User("test", "test@gmail.com", "testpw");
            dbUsers.save(user, function (err) {
                dbUsers.get("test", function (err, result) {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    if (result)
                        chai_1.expect(result).to.eql(user),
                            chai_1.expect(result.username).to.equal("test"),
                            chai_1.expect(result.email).to.equal("test@gmail.com"),
                            chai_1.expect(result.getPassword).to.not.equal("testpw");
                    //expect(passwordHash.verify("testpw", result.getPassword)).to.be.true,
                    //expect(passwordHash.isHashed(result.getPassword)).to.be.true
                    done();
                });
            });
        });
    });
    describe('#delete', function () {
        it('should delete user just saved', function (done) {
            dbUsers.delete("test", function (err) {
                dbUsers.get("test", function (err, result) {
                    chai_1.expect(err).to.not.be.null;
                    chai_1.expect(result).to.be.undefined;
                    done();
                });
            });
        });
    });
    describe('#getAll & #save ', function () {
        it('should save and get these two users', function (done) {
            var user1 = new users_1.User("test1", "test1@gmail.com", "test1pw");
            var user2 = new users_1.User("test2", "test2@gmail.com", "test2pw");
            var users = [];
            users.push(user1);
            users.push(user2);
            dbUsers.save(user1, function (err) {
                dbUsers.save(user2, function (err) {
                    dbUsers.getAll(function (err, result) {
                        chai_1.expect(err).to.be.null;
                        chai_1.expect(result).to.not.be.undefined;
                        chai_1.expect(result).to.have.length(2);
                        if (result)
                            chai_1.expect(result[0]).to.eql(user1),
                                chai_1.expect(result[1]).to.eql(user2);
                        done();
                    });
                });
            });
        });
    });
});
