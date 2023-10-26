import Express from 'express'
import axios from 'axios'
import 'dotenv/config'
import jwt from  'jsonwebtoken'
import fs from 'fs'
const router = Express.Router()

// This reads the environment file for storing secrets. Don't have a file? That can't be!
let env = fs.readFileSync('.env', {encoding: 'utf8'})

//Declaring variables and types
type GetToken = {
  access_token: string
}

type Token = {
  exp: number
}

//Nifty little thing
axios.interceptors.request.use((config) => {
  if(process.env.ACCESS_TOKEN)
  if (process.env.ACCESS_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.ACCESS_TOKEN}`;
  }
  return config;
});


/// VÄSTTRAFIK ROUTES ///
router.get('/getToken', async function (_request, response) {
  let data = await getAccessToken()
  response.send(data)
})

//Checks if there is a valid access token before fetching one.
async function getAccessToken() {

  if(process.env.ACCESS_TOKEN != "") {
    //Use the expiration-value in the JWT to check its timestamp with the current timestamp
    let jwtObject = <Token> jwt.decode(process.env.ACCESS_TOKEN as string)  
    let date = Date.now()
    
    if (date < jwtObject.exp * 1000)  {
      console.log('The access token is valid.')

      //If the token has not expired, it's good to go. Return the token and use it.
      return process.env.ACCESS_TOKEN 
    }
  } else {
    console.log('Access token is invalid. Grabbing a new one.')

    return await axios.post<GetToken>(
      'https://ext-api.vasttrafik.se/token', {
        'grant_type': 'client_credentials'
      },
      {
        headers: {
          'Authorization': 'Basic ' + process.env.AUTH_KEY,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      //This is where I do funny things with my access token.
      .then((response) => {
        fs.writeFileSync('.env', `
          AUTH_KEY="${process.env.AUTH_KEY}"
          ACCESS_TOKEN=""
        `)
        process.env.ACCESS_TOKEN = response.data.access_token
        console.log('Token successfully retrieved')
        fs.writeFileSync('.env', `AUTH_KEY="${process.env.AUTH_KEY}"\nACCESS_TOKEN="${response.data.access_token}"`)
        //The access token is now written to my .env-file. 
  
        return process.env.ACCESS_TOKEN
      })
      .catch((error) => {
        console.log(error)
        return error
      })
    }
    }


module.exports = router;
