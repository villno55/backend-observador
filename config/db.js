import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "3064975", 
  database: "sigma_mvp"
});

export default db;
