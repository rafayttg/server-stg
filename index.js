const express = require('express');
const app = express()
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
const dbcon = require('../dbconfig/db')
const routes = require('../routes/index')
const cors = require('cors')



dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors({
    origin: '*'
  }));


app.use('/' , routes)


app.listen(3000, () => console.log("Server ready on port 3000."));


