const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "tw",
  host: "localhost",
  port: 5432,
  database: "pernshoppinglist"
});

module.exports = pool;