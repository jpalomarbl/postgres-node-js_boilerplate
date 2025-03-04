// Here goes the logic to create the database, tables, etc...

import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "root",
    port: process.env.PGPORT || 5432,
    database: "postgres", // Postgres database.
});

const dbPool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "root",
    port: process.env.PGPORT || 5432,
    database: "my_new_database", // New database.
});

export default dbPool;

// DATABASE CREATION
const createDatabase = async (dbName) => {
  try {
    const client = await pool.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
  
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database created: '${dbName}'.`);
    } else {
      console.log(`Database already existed: '${dbName}'.`);
    }
  
    client.release();
  } catch (err) {
    console.error("There was an error while creating the new database:", err);
  }
};

// TABLE CREATION
const createTable = async () => {
  try {
    const client = await dbPool.connect();

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log("New table created or already existed: 'users'.");

    client.release();
  } catch (err) {
    console.error("There was an error while creating the new table:", err);
  }
};
  
  // Inserts mock data into the new table if it doesn't exist.
  const insertData = async () => {
    try {
      const client = await dbPool.connect();
  
      const insertDataQuery = `
        INSERT INTO users (name, email)
        VALUES 
        ('Pepe', 'pepe@email.com'),
        ('Ana', 'ana@email.com'),
        ('John', 'john@email.com'),
        ('Jane', 'jane@email.com'),
        ('Luis', 'luis@email.com'),
        ('Maria', 'maria@email.com'),
        ('Carlos', 'carlos@email.com'),
        ('Lucia', 'lucia@email.com'),
        ('David', 'david@email.com'),
        ('Sofia', 'sofia@email.com'),
        ('Miguel', 'miguel@email.com'),
        ('Laura', 'laura@email.com'),
        ('Oscar', 'oscar@email.com'),
        ('Clara', 'clara@email.com'),
        ('Victor', 'victor@email.com'),
        ('Elena', 'elena@email.com')
        ON CONFLICT DO NOTHING;
      `;
  
      await client.query(insertDataQuery);
      console.log("Data insertion completed or the data was already in the table.");
  
      client.release();
    } catch (err) {
      console.error("There was an error while inserting the data:", err);
    }
  };

await createDatabase('my_new_database');
await createTable();
await insertData();