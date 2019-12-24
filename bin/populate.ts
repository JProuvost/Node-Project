import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'
import fs = require('fs')

const dir: string = './db'
if (!fs.existsSync(dir))
  fs.mkdirSync(dir)

const dbMetrics: MetricsHandler = new MetricsHandler(dir + '/metrics')
const dbUsers: UserHandler = new UserHandler(dir + '/users')

const metrics1: Metric[] = [
  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),
  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)
]

const metrics2: Metric[] = [
  new Metric(`${new Date('2019-12-12 15:00 UTC').getTime()}`, 9),
  new Metric(`${new Date('2019-12-12 19:15 UTC').getTime()}`, 7),
  new Metric(`${new Date('2019-12-12 20:30 UTC').getTime()}`, 5)
]

const users: User[] = [
  new User("jean", "jean@gmail.com", "jeanpw"),
  new User("jordan", "jordan@gmail.com", "jordanpw")
]

users.forEach(user => {
  dbUsers.save(user, (err: Error | null) => {
    if (err) throw err
    console.log(user.username + ' added')
  })
})

dbMetrics.save("jean", metrics1, (err: Error | null) => {
  if (err) throw err
  console.log("Jean's metrics data populated")
})

dbMetrics.save("jordan", metrics2, (err: Error | null) => {
  if (err) throw err
  console.log("Jordan's metrics data populated")
})
