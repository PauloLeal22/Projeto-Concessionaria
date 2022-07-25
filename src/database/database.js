import mysql from 'mysql2';

let pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    database : 'db_concessionaria',
    user     : 'root',
    password : 'ph27092002'
});

export { pool };