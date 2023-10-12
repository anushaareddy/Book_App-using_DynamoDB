const express = require('express');
const route = express.Router()

const services = require('../services/render');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.homeRoutes);

/**
 *  @description add books
 *  @method GET /add-user
 */
route.get('/add-book', services.add_book)

/**
 *  @description for update user
 *  @method GET /update-user
 */
route.get('/update-book', services.update_book)


// API
route.post('/api/books', controller.create);
route.get('/api/books', controller.getBook);
route.get('/api/books/:id', controller.find);
route.put('/api/books/:id', controller.update);
route.delete('/api/books/:id', controller.delete);


module.exports = route