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