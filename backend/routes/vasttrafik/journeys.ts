import Express from 'express'
import axios from 'axios'

const router = Express.Router()

router.get('/journeys', (_request, response) => response.send('Welcome to the journeys route'))

let token: String
(async () => { 
  token = await axios.get('http://localhost:3000/vasttrafik/getToken')
})()

router.post('/journey', async function (request, response) {
  let result
  console.log(request.body) 
  try {
    await axios.get(`https://ext-api.vasttrafik.se/pr/v4/journeys?originGid=${request.body.originGid}&destinationGid=${request.body.destinationGid}`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    })
      .then((response) => {
        result = response.data.results
        console.dir(result, {depth: null})
      })
      .catch((error) => {
        console.error(error)
      })
    response.status(200).send(result)
  } catch (error) {
    console.error(error)
  }
})

router.post('/journey/detailed', async function (request, response) {
  let result
  console.log(request.body)
  try {
    await axios.get(`https://ext-api.vasttrafik.se/pr/v4/journeys/${request.body.detailsReference}/details`, {
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    })
    .then((response) => {
      result = response.data
      console.log(result)
    })
    .catch((error) => {
      console.error(error)
    })
    response.status(200).send(result)
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;
