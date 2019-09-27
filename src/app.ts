import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import mongoose from 'mongoose'

import routes from './routes'
class App {
    public express: express.Application

    public constructor () {
      dotenv.config({
        path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
      })

      this.express = express()
      this.express.disable('x-powered-by')
      this.express.use(helmet())

      this.database()
      this.middlewares()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private database (): void {
      mongoose.connect(process.env.MONGODB_CONNECTION, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }

    private routes (): void {
      routes(this.express)
    }
}

export default new App().express
