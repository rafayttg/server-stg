require("dotenv").config();
const Sequelize = require('sequelize')
const { Pool } = require('pg')


const sequelize = new Sequelize(
    process.env.DB_USER,
    process.env.DB,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        query: { raw: true },
        logging: false
    }

)

sequelize.authenticate().then(() => {
    console.log('Connection has been created')
}).catch((err) => {
    console.log(err)
})

const pool = new Pool({
    database:  process.env.DB,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})




module.exports =  { sequelize ,  pool}