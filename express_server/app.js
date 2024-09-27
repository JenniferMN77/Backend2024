const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/loquesea', function (req, res) {
    res.send('lo que sea x2')
  })


  app.get('*', function (req, res) {
    res.send('404 | NOT FOUND')
  })

app.listen(3000);
