import Express from 'express'
import axios from 'axios'

const router = Express.Router()

router.get('/stops', (_request, response) => response.send('Welcome to the stops route'))

let token: String
(async () => { 
  token = await axios.get('http://localhost:3000/vasttrafik/getToken')
})()

router.post('/sevenStops', async function (request, response) {
  let result
  console.log(request.body) 
  try {
    await axios.get(`https://ext-api.vasttrafik.se/pr/v4/locations/by-text?q=${request.body.query}&types=stoparea&limit=7&offset=0`, {
      headers: {
        'Authorization': 'Bearer ' + token,
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
