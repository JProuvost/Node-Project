import { Metric, MetricsHandler } from '../src/metrics'
import { User, UserHandler } from '../src/users'
import fs = require('fs')

const dir: string = './db'
if (!fs.existsSync(dir))
  fs.mkdirSync(dir)

const dbMetrics: MetricsHandler = new MetricsHandler(dir + '/metrics')
const dbUsers: UserHandler = new UserHandler(dir + '/users')

const metrics: Metric[] = [
  new Metric(`${new Date('2019-11-04 14:00 UTC').getTime()}`, 12),
  new Metric(`${new Date('2019-11-04 14:15 UTC').getTime()}`, 10),
  new Metric(`${new Date('2019-11-04 14:30 UTC').getTime()}`, 8)
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

dbMetrics.save('0', metrics, (err: Error | null) => {
  if (err) throw err
  console.log('Metrics data populated')
})
