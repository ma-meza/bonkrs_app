const Pool = require("pg").Pool;

const pool = new Pool({
    user: process.env.POSTGRES_RDS_USERNAME,
    password: process.env.POSTGRES_RDS_PWD,
    host: "main-postgres-db.c3bllwgxn2ue.us-east-1.rds.amazonaws.com",
    post: 5432,
    database: "main_postgres_db"
})

module.exports = pool;