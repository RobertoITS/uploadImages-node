const {Router}  = require('express');
const { getUsers, addUser } = require('../controllers/user.controllers');

const route = Router();

route.get('/', getUsers)
route.post('/', addUser)


module.exports = route;