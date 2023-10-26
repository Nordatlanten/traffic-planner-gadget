import express from 'express'
import cors from 'cors'


const app: express.Application = express()
const port: number = 3000

const allowedOrigins = ['http://localhost:4000']

const options: cors.CorsOptions = {
  origin: allowedOrigins
}

app.use(cors(options))
app.use(express.json())

app.listen(port, () => console.log('Started server on port: ' + port))

app.use('/vasttrafik', require('./routes/vasttrafik/index.ts'))
app.use('/vasttrafik', require('./routes/vasttrafik/stops.ts'))
app.use('/vasttrafik', require('./routes/vasttrafik/journeys.ts'))
app.use('/auth', require('./routes/auth/index.ts'))
