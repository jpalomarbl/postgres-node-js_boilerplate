# Simple PostgreSQL + Node + JavaScript backend
Hey there! I made this small project to practise making a backend from scratch on using PostgreSQL (the main folder in my computer for this project is literally called *postgretest2final*). This means that it is very basic and can be full of mistakes. I plan on improving it on the long run.

I got the information I used to make this boilerplate from [Beaufort Tek's](https://www.youtube.com/@AustinBeaufort) video called [*Build a Rest Api with NodeJS (JavaScript), Express, and PostgreSQL*](https://www.youtube.com/watch?v=DihOP19LQdg), Stack Overflow, ChatGPT and God itself. I really recommend Beaufort Tek's video if you want a step by step guide.

## What can you expect from this repo?
A starting point if you need a basic PostgreSQL backend. It has one table, one of each types of request you can make to a REST API, and some error handling.

Change as many things as you want and feel free to make as many pull requests as you want to make it your own.

## What do you need before you start?
* Git
* Node
* Any IDE, but I recommend Visual Studio Code.
* PostgreSQL 10+.
* Postman (Optional but recommended. You can also use your browser if you're feeling specially hardcore today).
* Some coffee and a dream.
* *Jesus*?

## Getting started

1. Clone this repository

```shell
git clone git@github.com:jpalomarbl/postgres-node-js_boilerplate.git
```

2. Install the dependencies

```shell
npm install
```

3. Start the server by running:

```shell
npm run start

# If you set up your environmental variables in the .env file run this instead
npm run start-env
```

4. Have fun! Or at least all the fun you can have while coding!

## Full guide
Here, we're gonna explain the following:

* How to create a new database, tables and inserting mock data (*database.js*).
* How to start your API (*server.js*).
* How queries and endpoints work together (*src* folder).

### Creating a new database
To host the tables where we will insert all of our data, we need a new database. But first we need our global pool to conect to postgres. A Pool is a collection of reusable connections to a PostgreSQL database. In this case, we will conect to the global *postgres* that holds all of your other databases to, later, create our new database for the project:

```js
// dataBase.js

const pool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "root",
    port: process.env.PGPORT || 5432,
    database: "postgres", // Global Postgres database.
});
```

**You can specify your own credentials on the .env file.**

Now, we create a function that checks if the database we want to create already exists, and if it doesn't, it creates it:

```js
// dataBase.js

const createDatabase = async (dbName) => {
  try {
    // Checks if the database already exists.
    const client = await pool.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
  
    // If it doesn't already exist, the function creates the new database.
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
```

Now that we have it, let's make a pool to conect directly to our new database. Let's alse export it, because we want to use this connection to make our queries later.

```js
// dataBase.js

const dbPool = new Pool({
    user: process.env.PGUSER || "postgres",
    host: process.env.PGHOST || "localhost",
    password: process.env.PGPASSWORD || "root",
    port: process.env.PGPORT || 5432,
    database: "my_new_database", // New database.
});

export default dbPool;
```

### Creating a new table
Let's create our first table.

```js
// dataBase.js

const createTable = async () => {
  try {
    const client = await dbPool.connect();

    // If it doesn't already exist, the function creates the new table.
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
```

### Inserting mock data
Let's fill our table with mock data.

```js
// dataBase.js

const insertData = async () => {
    try {
      const client = await dbPool.connect();
  
    // If there is any conflict (like repeated primary keys, f. ex.) it aborts the insertion.
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
```

To run just the database configuration, you can run

```shell
node dataBase.js
```

Or if you specified your postgres credentials on the .env file

```shell
node --env-file=.env dataBase.js
```

Now, if we want to see that everything worked out fine we have to go to the PostgreSQL shell (just search for *psql* in you Windows search bar).

Then we log in and list all the databases using `\l`. There we should see our new database listed. After this, we can connect to our database by running `\c [DATABASE NAME]` and executing the following query:

```sql
SELECT * FROM users;
```

### Start your API

Now, we will explain how to start our API. We just need to specify our port, and that te base URL will be "/".

```js
import express from 'express';
import router from './src/users/routes.js';

const app = express();
const port = 3000;
  
app.use(express.json());

// Ruta inicial para iniciar el proceso
app.get("/", async (req, res) => {
    res.send("Conected!");
});

app.use('/api/v1/users', router); // This sets the BASE ROUTE.

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
```

This way if we search for `http://localhost:3000` on our browser, we should the the *Conected!* mesage. We've also set `http://localhost:3000/api/v1/users` to be our base route for requests.

### How queries and endpoints work
Inside of our *src/users* folder, we have 3 files:
* **queries.js**: Here is where we write our string SQL queries, to separate them from the logic of the app.
* **controller.js**: This is the logic behind every type of request.
* **router.js**: Here, we specify what logic runs for each endpoint.

First, *queries.js*. This file holds an object of SQL string queries which we later export. If we need a variable inside any of the queries, we use *$1, $2, $3, etc...* The order of these depends on the parameter order we specify for each endpoint in the *router.js* file. For example, the endpoint "/:name&:email" holds two variables. On the *postNewUser* SQL query, *$1* corresponds to *:name* and *$2* corresponds to *:email*.

```js
const queries = {
    getUsers: "SELECT * FROM users;",

    // To use a param in a query just add them in the same order they go into the URL.
    getUserById: "SELECT * FROM users WHERE id=$1;",

    // For example, the URL to post a new user adds "/:name&:email",
    // so $1 is :name, and $2 is :email.
    postNewUser: "INSERT INTO users (name, email) VALUES ($1, $2);",

    deleteUser: "DELETE FROM users WHERE id=$1;",
    updateUserEmail: "UPDATE users SET email=$2 WHERE id=$1;",
    updateUserName: "UPDATE users SET name=$2 WHERE id=$1;"
};

export default queries;
```

Now, *controller.js*. Here, we specify what happends before and after running each query. For example, let's see what happens with the *postNewUser* query.

```js
// Notice that here we will use the connection with the database we stablished in "dataBase.js".
// And the queries from "queries.js".
import dbPool from "../../dataBase.js";
import queries from "./queries.js";

// This is a simple way to validate an email with regex.
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// ...

// I chose to name this function the same as the query,
// but you can name it whatever you want.
const postNewUser = (req, res, next) => {
    // Get the URL parameters
    const name = req.params.name;
    const email = req.params.email;

    if (!validateEmail(email)) {
        throw new Error("This email is not valid!");
    }

    dbPool.query(
        queries.postNewUser,
        // This is how we pass parameters to a query
        [name, email],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("Email already in use!"));

                return;
            }

            // If everything went fine, we send a 200 status to the client.
            res.status(200).json(result.rows);
        }
    );
};

// ...

// Then, we export every controller function to use them in the "router.js" file.
const getters = {
    getUsers,
    getUserById,
    postNewUser,
    deleteUser,
    updateUserEmail,
    updateUserName
}

export default getters;
```

Notice that we get the URL parameters from the *req* value. Remember that the endpoint to post a new user is */:name&:email*. Then we validate the email and make the query. See that we have to pass the parameters using and array.

The error handling is worth mentioning. Ouside of the query, we THROW the errors, but inside of it, we use the NEXT method. We don't need a try-catch bock because *express* does the internal error handling for us.

Finally, *router.js*. This is simple: we specify **which REST method to use** (get, put, post or delete), with **which controller function** (*postNewUser, getUsers, etc...*), and with which endpoint they're associated.

```js
import Router from 'express';
import getters from './controller.js';

const router = Router();

// If we don't add anything after the BASE ROUTE,
// we GET the list of users
router.get('/', getters.getUsers);

// If we add an ID after the base route,
// we GET the info of the user with said ID.
router.get('/:id', getters.getUserById);

// If we add two parameters separated by "&",
// we POST a user to the users table
router.post('/:name&:email', getters.postNewUser);

// If we add an ID after the base route,
// we DELETE a user.
router.delete('/:id', getters.deleteUser);

router.put('/email/:id&:email', getters.updateUserEmail);
router.put('/name/:id&:name', getters.updateUserName);

export default router;
```

For example, if we wanted to add a new user we should run the following to start our server:

```shell
npm run start
```

Or, if you set you postgres credentials in .env

```shell
npm run start-env
```

Then, we could go to Postman or our browser and go to `http://localhost:3000/api/v1/users/John&johnDoe@email.com`.
