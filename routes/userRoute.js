const express = require('express');
const path = require('path');
const user_route = express();

user_route.set('view engine', 'ejs');
user_route.set('views',"./views/users");


const userController = require('../controllers/UserController');

user_route.get('/',userController.loadLogin);
user_route.get('/register', userController.loadRegister);

user_route.post('/verifyRegister', userController.loadVerifyRegister)
user_route.post('/verifyLogin', userController.loadVerifyLogin)
user_route.get('/home', userController.loadHome)
user_route.get('/add-project', userController.loadnewProject)

user_route.post('/addNewProject', userController.load_addNewProject)
user_route.get('/addTask', userController.loadAddTask)
user_route.get('/viewTasks', userController.loadViewTasks)


user_route.post('/taskUpdate', userController.loadTaskUpdate)

module.exports = user_route;