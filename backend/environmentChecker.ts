import fs from 'fs'
import PromptSync = require('prompt-sync')
import jwt from 'jsonwebtoken'
import 'dotenv/config'

//This is a script that allows my software to create an environment file if it does not already exist.

const prompt = PromptSync({sigint: true})

type CreationOptions = 'y' | 'n' | null;
type Token = {
  exp: number
}

//Attempt to create variable from existing file
try {
  let env = fs.readFileSync('.env', {encoding: 'utf8'})

  //Use the expiration-value in the JWT to check its timestamp with the current timestamp
  let jwtObject = <Token> jwt.decode(process.env.ACCESS_TOKEN as string)  
  let date = Date.now()
  
  if (date < jwtObject.exp * 1000)  {
    console.log('The access token is valid.')

    //If the token has not expired, it's good to go. Return the token and use it.
    
  } else {
    fs.unlinkSync('.env')
    throw new TypeError("Token has expired. So we deleted the file. Good bye file.");
  }

} catch (error) {
  //If file doesn't exist, run the actual script.

  console.log('Could not find a .env file in project.')
  let createFileCheck: CreationOptions = null

  //Prompt the user and proceed when a valid value has been received
  while (createFileCheck !== 'y' && createFileCheck !== 'n'){
    if(createFileCheck != null) {
      console.log('Invalid input.')
    }
    createFileCheck = <CreationOptions> prompt('Would you like to create one? (y / n) | ', 'n')
  }

  if (createFileCheck === 'n'){
    throw new Error('We need a .env-file to start the application.')
  }

  ///Ask about AUTH_KEY and ACCESS_TOKEN values here and create the file
  let authKey: String = prompt('What is your AUTH_KEY value? | ', '')
  console.log('AUTH_KEY: ', authKey)

  let correctValuesCheck: CreationOptions = null
  let storedValues: string = `AUTH_KEY="${authKey}"\nACCESS_TOKEN=""`
  console.log(`Environment file with following data will be created:\n${storedValues}`)

  //Prompt the user and proceed when a valid value has been received
  while (correctValuesCheck !== 'y' && correctValuesCheck !== 'n'){
    if(correctValuesCheck != null) {
      console.log('Invalid input.')
    }
    correctValuesCheck = <CreationOptions> prompt('Are these values fine? AUTH_KEY will be created by app. (y / n) | ', 'n')
  }

  if (correctValuesCheck === 'n'){
    throw new Error('Please try again with the correct values.')
  }
  console.log('Proceeding to create .env-file')
  fs.writeFileSync('.env', storedValues, {encoding: 'utf8'})
  console.log('Created .env file. Now proceeding to check the file before starting application.')
}
