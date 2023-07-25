import express from 'express'

const app: express.Application = express()
const port: number = 3000


app.listen(port, () => console.log('Started server on port: ' + port))

//Look up if there's a smarter way to load multiple files on the same route
app.use('/vasttrafik', require('./routes/vasttrafik/index.ts'))
app.use('/vasttrafik', require('./routes/vasttrafik/stops.ts'))