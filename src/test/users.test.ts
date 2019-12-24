import { expect } from 'chai'
import { User, UserHandler } from '../users'
import { LevelDB } from "../leveldb"

const dbPath: string = './db_test'
var dbUsers: UserHandler
var passwordHash = require('password-hash');

describe('User', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbUsers = new UserHandler(dbPath)
  })

  after(function () {
    dbUsers.closeDB()
  })

  describe('#get', function () {
    it("shouldn't get any user", function (done) {
      dbUsers.get("0", function (err: Error | null, result?: User) {
        expect(err).to.not.be.null
        expect(result).to.be.undefined
        done()
      })
    })
  })

  describe('#get & #save ', function () {
    it('should save and get one', function (done) {
      let user: User = new User("test", "test@gmail.com", "testpw")
      dbUsers.save(user, function (err: Error | null) {
        dbUsers.get("test", function (err: Error | null, result?: User) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          if (result)
            expect(result).to.eql(user),
            expect(result.username).to.equal("test"),
            expect(result.email).to.equal("test@gmail.com"),
            expect(result.getPassword).to.not.equal("testpw")
          //expect(passwordHash.verify("testpw", result.getPassword)).to.be.true,
          //expect(passwordHash.isHashed(result.getPassword)).to.be.true
            done()
        })
      })
    })
  })

  describe('#delete', function () {
    it('should delete user just saved', function (done) {
      dbUsers.delete("test", function (err: Error | null) {
        dbUsers.get("test", function (err: Error | null, result?: User) {
          expect(err).to.not.be.null
          expect(result).to.be.undefined
          done()
        })
      })
    })
  })

  describe('#getAll & #save ', function () {
    it('should save and get these two users', function (done) {
      let user1: User = new User("test1", "test1@gmail.com", "test1pw")
      let user2: User = new User("test2", "test2@gmail.com", "test2pw")
      let users: User[] = []
      users.push(user1)
      users.push(user2)

      dbUsers.save(user1, function (err: Error | null) {
        dbUsers.save(user2, function (err: Error | null) {
          dbUsers.getAll(function (err: Error | null, result?: User[]) {
            expect(err).to.be.null
            expect(result).to.not.be.undefined
            expect(result).to.have.length(2)
            if(result)
              expect(result[0]).to.eql(user1),
              expect(result[1]).to.eql(user2)
            done()
          })
        })
      })
    })
  })
})
