// Here goes all your SQL queries.

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