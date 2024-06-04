const express = require('express')
const auth = express.Router()

const userRegister = require ('../controller/registration/registrationController')
const userLogin = require('../controller/login/logInController')


auth.post('/login', userLogin.adminLogIn);
auth.post('/register', userRegister.adminRegister);
// vendor.get('/:id', userController.getUserById);
// vendor.put('/:id', userController.updateUser);
// vendor.delete('/:id', userController.deleteUser);


module.exports = auth