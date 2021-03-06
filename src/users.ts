import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

var passwordHash = require('password-hash');

export class User {
  public username: string
  public email: string
  private password: string = ""

  constructor(username: string, email: string, password: string, passwordHashed: boolean = passwordHash.isHashed(password)) {
    this.username = username
    this.email = email

    if (!passwordHashed) {
      this.setPassword(password)
    } else {
      this.password = password
    }
  }

  static fromDb(username: string, value: any): User {
    const [password, email] = value.split(":")
    return new User(username, email, password)
  }

  public setPassword(toSet: string): void {
    // Hash and set password
    this.password = passwordHash.generate(toSet)
  }

  public getPassword(): string {
    return this.password
  }

  public validatePassword(toValidate: String): boolean {
    // return comparison with hashed password
    return passwordHash.verify(toValidate, this.password)
  }
}

export class UserHandler {
  public db: any

  public get(username: string, callback: (err: Error | null, result?: User) => void) {
    this.db.get(`user:${username}`, function (err: Error, data: any) {
      if (err) callback(err)
      else if (data === undefined) callback(null, data)
      else {
        callback(null, User.fromDb(username, data))
      }
    })
  }

  public getAll(callback: (err: Error | null, result?: User[]) => void) {
    const stream = this.db.createReadStream()
    var users: User[] = []
    
    stream.on('error', callback)
      .on('data', (data: any) => {
        //console.log(data)
        let username: string = data.key.split(':')[1]
        //console.log(username)
        users.push(User.fromDb(username, data.value))
      })
      .on('end', (err: Error) => {
        callback(null, users)
      })
  }

  public save(user: User, callback: (err: Error | null) => void) {
    this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
      callback(err)
    })
  }

  public delete(username: string, callback: (err: Error | null) => void) {
    this.db.del(`user:${username}`, (err: Error | null) => {
      callback(err);
    });
  }

  constructor(path: string) {
    this.db = LevelDB.open(path);
  }

  public closeDB(){
    this.db.close()
  }
}
