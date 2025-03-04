// Here goes the logic behind every operation

import dbPool from "../../dataBase.js";
import queries from "./queries.js";

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const getUsers = (req, res, next) => {
    dbPool.query(
        queries.getUsers,
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("Something went wrong!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

// To pass and parameter via URL, you get it through the "req"
// function parameter.
const getUserById = (req, res, next) => {
    const id = +req.params.id;

    if (id <= 0) {
        next(new Error("Invalid ID. Param must be greater than 0!"));
    }
    
    dbPool.query(
        queries.getUserById,
        // Don't forget to add your parameter here!!!
        [id],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("No rows found. Id nonexistent!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

const postNewUser = (req, res, next) => {
    const name = req.params.name;
    const email = req.params.email;

    if (!validateEmail(email)) {
        throw new Error("This email is not valid!");
    }

    dbPool.query(
        queries.postNewUser,
        [name, email],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("Email already in use!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

const deleteUser = (req, res, next) => {
    const id = +req.params.id;

    if (id <= 0) {
        next(new Error("Invalid ID. Param must be greater than 0!"));
    }

    dbPool.query(
        queries.deleteUser,

        [id],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("No rows deleted. Id nonexistent!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

const updateUserEmail = (req, res, next) => {
    const id = +req.params.id;
    const email = req.params.email;

    if (id <= 0) {
        next(new Error("Invalid ID. Param must be greater than 0!"));
    } else if (!validateEmail(email)) {
        throw new Error("This email is not valid!");
    }

    dbPool.query(
        queries.updateUserEmail,

        [id, email],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("No rows updated. Id nonexistent!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

const updateUserName = (req, res, next) => {
    const id = +req.params.id;
    const name = req.params.name;

    if (id <= 0) {
        next(new Error("Invalid ID. Param must be greater than 0!"));
    }

    dbPool.query(
        queries.updateUserName,

        [id, name.replace("+", " ")],
        (err, result) => {
            if (err) next(err);

            if (!result || result.rowCount === 0) {
                next(new Error("No rows updated. Id nonexistent!"));

                return;
            }

            res.status(200).json(result.rows);
        }
    );
};

const getters = {
    getUsers,
    getUserById,
    postNewUser,
    deleteUser,
    updateUserEmail,
    updateUserName
}

export default getters;
