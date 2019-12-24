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

    it('should save and get', function (done) {
      let user: User = new User("test", "test@gmail.com", "testpw")
      dbUsers.save(user, function (err: Error | null) {
        dbUsers.get("test", function (err: Error | null, result?: User) {
          expect(err).to.be.null
          expect(result).to.not.be.undefined
          if (result)
            expect(result).to.eql(user),
            expect(result.username).to.equal("test"),
            expect(result.email).to.equal("test@gmail.com")
            //expect(passwordHash.verify("testpw", result.getPassword)).to.be.true,
            //expect(passwordHash.isHashed(result.getPassword)).to.be.true
        })
        done()
      })
    })
  })
})
