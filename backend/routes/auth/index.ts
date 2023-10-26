import Express from 'express'
import axios from 'axios'
import jwt from  'jsonwebtoken'

const router = Express.Router()

router.get('/', (_request, response) => response.send('Welcome to the auth route'))

router.get('/getToken', (request, response) => {
  let token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
    data: 'remind ya im kinda wet drip down my vagina'
  }, 'secret')
  response.send(token)
})

module.exports = router;
