import Express from 'express'
import axios from 'axios'

const router = Express.Router()

router.get('/stops', (_request, response) => response.send('Welcome to the stops route'))

const uri = 'locations/by-text?q=oppan&types=stoparea&limit=10&offset=0'

let token: String
(async () => { 
  token = await axios.get('http://localhost:3000/vasttrafik/getToken')
})()

router.get('/tenStops', async function (_request, response) {
  let result 
  try {
    await axios.get('https://ext-api.vasttrafik.se/pr/v4/' + uri, {
      headers: {
        'Authorization': 'Bearer ' + token
      },
    })
      .then((response) => {
        result = response.data.results
        
      })
      .catch((error) => {
        console.log(error)
      })
    response.status(200).send(result)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;