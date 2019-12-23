import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  private db: any 
  
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
  
  public closeDB(){
    this.db.close()
  }
  
  public save(username: string, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${username}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
  
  public get(username: string, callback: (err: Error | null, result?: Metric[]) => void) {
    const stream = this.db.createReadStream()
    var met: Metric[] = []
    
    stream.on('error', callback)
      .on('data', (data: any) => {
        console.log(data)
        let user: string = data.key.split(':')[1];
        let timestamp: string = data.key.split(':')[2];
        /*const [_, k, timestamp] = data.key.split(":")*/
        const value = data.value
        if (username != user) {
          console.log(`LevelDB error: ${user} does not match key ${username}`)
        } else {
          met.push(new Metric(timestamp, value))
        }
      })
      .on('end', (err: Error) => {
        callback(null, met)
      })
  }
}
