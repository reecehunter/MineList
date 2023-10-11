const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

app.get('/plugins', function(req, res) {
  const plugins = [{
    id: 1,
    name: 'Example Plugin',
    description: 'This is a short description summarizing this example plugin.',
    downloads: 0,
    imgSrc: 'https://images.heb.com/is/image/HEBGrocery/000377497-1',
    userID: 1,
    vanity_url: 'example',
    followers: 0,
    username: 'reece',
    tags: ['Fun'],
    versions: ['1.20'],
    platforms: ['Paper'],
  }]
  res.json({ plugins })
})

// Start the app
app.listen(5050, () => {
    console.log("App started on port 5050")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
